import { Model, HydratedDocument } from "mongoose";

interface PaginationOptions {
  page?: number;
  limit?: number;
}

class GenericRepository<T> {
  protected model: Model<T>;
  protected hiddenFields: string[] = [];

  constructor(model: Model<T>) {
    this.model = model;
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
    return this.model.create(data);
  }

  async createMany(data: Partial<T>[]): Promise<HydratedDocument<T>[]> {
    return (await this.model.insertMany(data)) as HydratedDocument<T>[];
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
  }: {
    page?: number;
    limit?: number;
    pipeline?: any[];
    search?: string;
    fields?: string[];
  }) {
    const skip = (page - 1) * limit;

    let query: any = {};

    if (this.model.schema.paths.isDeleted) {
      query.isDeleted = { $ne: true };
    }
    if (this.model.schema.paths.is_active) {
      query.is_active = { $ne: false };
    }

    if (search && fields.length > 0) {
      query.$or = fields.map((field) => {
        if (field === "amount") {
          return {
            $expr: {
              $regexMatch: {
                input: { $toString: `$${field}` },
                regex: search,
                options: "i",
              },
            },
          };
        }

        return {
          [field]: {
            $regex: search,
            $options: "i",
          },
        };
      });
    }

    const matchStage = Object.keys(query).length > 0 ? [{ $match: query }] : [];

    const dataPipeline = [
      ...pipeline,
      ...matchStage,
      { $skip: skip },
      { $limit: limit },
    ];

    const countPipeline = [...pipeline, ...matchStage, { $count: "total" }];

    const [data, countResult] = await Promise.all([
      this.model.aggregate(dataPipeline),
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
      { new: true },
    );
  }

  async findAll(): Promise<HydratedDocument<T>[]> {
    return this.model.find();
  }

  async search({
    page = 1,
    limit = 10,
    search = "",
    fields = [],
    filter = {},
  }: {
    page?: number;
    limit?: number;
    search?: string;
    fields?: string[];
    filter?: Record<string, any>;
  }) {
    const skip = (page - 1) * limit;

    let query: any = { ...filter };

    if (this.model.schema.paths.isDeleted) {
      query.isDeleted = { $ne: true };
    }
    if (this.model.schema.paths.is_active) {
      query.is_active = { $ne: false };
    }

    if (search && fields.length > 0) {
      query.$or = fields.map((field) => {
        if (field === "locker_number") {
          return {
            $expr: {
              $regexMatch: {
                input: { $toString: `$${field}` },
                regex: search,
                options: "i",
              },
            },
          };
        }

        return {
          [field]: {
            $regex: search,
            $options: "i",
          },
        };
      });
    }

    const data = await this.model.find(query).skip(skip).limit(limit);

    const total = await this.model.countDocuments(query);

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
    );
  }

  async findById(id: string): Promise<HydratedDocument<T> | null> {
    return this.model.findById(id);
  }

  async update(
    id: string,
    data: Partial<T>,
  ): Promise<HydratedDocument<T> | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<HydratedDocument<T> | null> {
    return this.model.findByIdAndDelete(id);
  }
}

export default GenericRepository;
