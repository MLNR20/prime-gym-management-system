import { Model, HydratedDocument } from "mongoose";

interface PaginationOptions {
  page?: number;
  limit?: number;
}

class GenericRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
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

  async findAll(): Promise<HydratedDocument<T>[]> {
    return this.model.find();
  }

  async paginate({ page = 1, limit = 10 }: PaginationOptions) {
    const skip = (page - 1) * limit;
    const data = await this.model.find().skip(skip).limit(limit);
    const total = await this.model.countDocuments();

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
