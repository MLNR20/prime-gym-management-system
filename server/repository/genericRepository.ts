import { Model, HydratedDocument } from "mongoose";

class GenericRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  /** Create a single document */
  async create(data: Partial<T>): Promise<HydratedDocument<T>> {
    return this.model.create(data);
  }

  /** Create many documents */
  async createMany(data: Partial<T>[]): Promise<HydratedDocument<T>[]> {
    return (await this.model.insertMany(data)) as HydratedDocument<T>[];
  }

  /** Find all documents */
  async findAll(): Promise<HydratedDocument<T>[]> {
    return this.model.find();
  }

  /** Find document by ID */
  async findById(id: string): Promise<HydratedDocument<T> | null> {
    return this.model.findById(id);
  }

  /** Update document by ID */
  async update(id: string, data: Partial<T>): Promise<HydratedDocument<T> | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  /** Delete document by ID */
  async delete(id: string): Promise<HydratedDocument<T> | null> {
    return this.model.findByIdAndDelete(id);
  }
}

export default GenericRepository;
