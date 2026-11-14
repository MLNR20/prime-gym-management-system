import { Model, HydratedDocument, ClientSession } from "mongoose";

interface PaginationOptions {
  page?: number;
  limit?: number;
}

// Numeric fields are searched as text so "12" can match 120 or 12.5.
const NUMERIC_SEARCH_FIELDS = ["amount", "locker_number"];

const escapeRegex = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Builds the match clauses for a search box. The text is split on whitespace and
 * every word must match at least one of the fields, so "john doe" finds a
 * customer whose first_name is John and last_name is Doe. Words are matched
 * literally, so characters like ( + . [ never act as regex syntax.
 */
export function buildSearchClauses(search: string, fields: string[]): Record<string, any>[] {
  const terms = String(search ?? "").split(/\s+/).filter(Boolean);
  if (terms.length === 0 || fields.length === 0) return [];

  return terms.map((term) => {
    const pattern = escapeRegex(term);
    return {
      $or: fields.map((field) =>
        NUMERIC_SEARCH_FIELDS.includes(field)
          ? { $expr: { $regexMatch: { input: { $toString: `$${field}` }, regex: pattern, options: "i" } } }
          : { [field]: { $regex: pattern, $options: "i" } },
      ),
    };
  });
}

export interface SortOptions {
  sortBy?: string | undefined;
  sortOrder?: "asc" | "desc" | undefined;
}

// Only plain field names are accepted, so a request can never smuggle operators
// or dotted paths into a sort stage.
const SORTABLE_FIELD = /^[A-Za-z_][A-Za-z0-9_]{0,63}$/;

// Case-insensitive ordering so "apple" does not sort after "Zebra".
const SORT_COLLATION = { locale: "en", strength: 2 } as const;

/** Reads `sortBy` / `sortOrder` from a request query; invalid input means "no sort". */
export function parseSort(query: Record<string, any>): SortOptions {
  const sortBy = typeof query.sortBy === "string" ? query.sortBy : "";
  if (!SORTABLE_FIELD.test(sortBy)) return {};
  return { sortBy, sortOrder: query.sortOrder === "desc" ? "desc" : "asc" };
}

// _id is the tiebreaker so rows with equal values keep a stable order across pages.
function buildSortStage({ sortBy, sortOrder }: SortOptions): Record<string, 1 | -1> | null {
  if (!sortBy) return null;
  const direction = sortOrder === "desc" ? -1 : 1;
  return { [sortBy]: direction, _id: direction };
}

class GenericRepository<T> {
  protected model: Model<T>;
  protected hiddenFields: string[] = [];
  protected dbSession: ClientSession | null = null;

  constructor(model: Model<T>) {
    this.model = model;
  }

  /**
   * Returns a copy of this repository whose operations run inside the given
   * transaction session. Used by the unit of work; the original is untouched.
   */
  withSession(session: ClientSession): this {
    const bound = Object.create(Object.getPrototypeOf(this)) as this;
    Object.assign(bound, this, { dbSession: session });
    return bound;
  }

  protected sanitize(doc: any) {
    if (!doc) return doc;

    const obj = doc.toObject ? doc.toObject() : { ...doc };

    if (!this.hiddenFields.length) return obj;

    for (const field of this.hiddenFields) {
      delete obj[field];
    }

    return obj;
  }
  async create(data: Partial<T>): Promise<HydratedDocument<T>> {
    const [doc] = await this.model.create([data], { session: this.dbSession });
    return doc as HydratedDocument<T>;
  }

  async createMany(data: Partial<T>[]): Promise<HydratedDocument<T>[]> {
    return (await this.model.insertMany(data, {
      session: this.dbSession,
    })) as unknown as HydratedDocument<T>[];
  }

  async deleteMany(data: Partial<T>[]): Promise<HydratedDocument<T>[]> {
    const docs = await this.model.find({ $or: data });
    await this.model.deleteMany({ $or: data });
    return docs;
  }

  /**
   * @param data Array of { filter, update } objects
   */
  async updateMany(
    data: { filter: Partial<T>; update: Partial<T> }[],
  ): Promise<HydratedDocument<T>[]> {
    const updatedDocs: HydratedDocument<T>[] = [];

    for (const item of data) {
      const doc = await this.model.findOneAndUpdate(item.filter, item.update, {
        new: true,
      });
      if (doc) updatedDocs.push(doc);
    }

    return updatedDocs;
  }

  async paginateWithLookup({
    page = 1,
    limit = 10,
    pipeline = [],
    search = "",
    fields = [],
    sortBy,
    sortOrder,
  }: {
    page?: number;
    limit?: number;
    pipeline?: any[];
    search?: string;
    fields?: string[];
  } & SortOptions) {
    const skip = (page - 1) * limit;

    let query: any = {};

    if (this.model.schema.paths.isDeleted) {
      query.isDeleted = { $ne: true };
    }
    if (this.model.schema.paths.is_active) {
      query.is_active = { $ne: false };
    }

    const searchClauses = buildSearchClauses(search, fields);
    if (searchClauses.length > 0) query.$and = searchClauses;

    const matchStage = Object.keys(query).length > 0 ? [{ $match: query }] : [];

    const sortStage = buildSortStage({ sortBy, sortOrder });

    const dataPipeline = [
      ...pipeline,
      ...matchStage,
      ...(sortStage ? [{ $sort: sortStage }] : []),
      { $skip: skip },
      { $limit: limit },
    ];

    const countPipeline = [...pipeline, ...matchStage, { $count: "total" }];

    const dataAggregate = this.model.aggregate(dataPipeline);
    if (sortStage) dataAggregate.collation(SORT_COLLATION);

    const [data, countResult] = await Promise.all([
      dataAggregate,
      this.model.aggregate(countPipeline),
    ]);

    const total = countResult[0]?.total || 0;

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
  }

  async updateSpecificDetails(id: string, data: Partial<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, session: this.dbSession },
    );
  }

  async findAll(): Promise<HydratedDocument<T>[]> {
    return this.model.find().session(this.dbSession);
  }

  async search({
    page = 1,
    limit = 10,
    search = "",
    fields = [],
    filter = {},
    includeDeleted = false,
    sortBy,
    sortOrder,
  }: {
    page?: number;
    limit?: number;
    search?: string;
    fields?: string[];
    filter?: Record<string, any>;
    includeDeleted?: boolean;
  } & SortOptions) {
    const skip = (page - 1) * limit;

    let query: any = { ...filter };

    if (!includeDeleted && this.model.schema.paths.isDeleted) {
      query.isDeleted = { $ne: true };
    }
    if (this.model.schema.paths.is_active) {
      query.is_active = { $ne: false };
    }

    const searchClauses = buildSearchClauses(search, fields);
    if (searchClauses.length > 0) query.$and = [...(query.$and ?? []), ...searchClauses];

    const sortStage = buildSortStage({ sortBy, sortOrder });
    const dataQuery = this.model.find(query).session(this.dbSession);
    if (sortStage) dataQuery.sort(sortStage).collation(SORT_COLLATION);
    const data = await dataQuery.skip(skip).limit(limit);

    const total = await this.model
      .countDocuments(query)
      .session(this.dbSession);

    return {
      data: data.map((d) => this.sanitize(d)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
  }

  async paginate({ page = 1, limit = 10 }: PaginationOptions) {
    const skip = (page - 1) * limit;
    const data = await this.model.find().skip(skip).limit(limit);
    const total = await this.model.estimatedDocumentCount();

    return {
      data: data.map((doc) => this.sanitize(doc)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
  }

  async softDelete(
    id: string,
    status: Boolean,
  ): Promise<HydratedDocument<T> | null> {
    return this.model.findOneAndUpdate(
      { _id: id },
      { $set: { isDeleted: status } },
      { session: this.dbSession },
    );
  }

  async findById(id: string): Promise<HydratedDocument<T> | null> {
    return this.model.findById(id).session(this.dbSession);
  }

  async update(
    id: string,
    data: Partial<T>,
  ): Promise<HydratedDocument<T> | null> {
    return this.model.findByIdAndUpdate(id, data, {
      new: true,
      session: this.dbSession,
    });
  }

  async delete(id: string): Promise<HydratedDocument<T> | null> {
    return this.model.findByIdAndDelete(id, { session: this.dbSession });
  }
}

export default GenericRepository;
