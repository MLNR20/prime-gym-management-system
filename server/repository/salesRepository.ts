import Sales, { ISalesDocument } from "../models/sales";
import GenericRepository from "./genericRepository";
import { ISalesRepository } from "./interface/salesRepositoryInterface";

export class SalesRepository
  extends GenericRepository<ISalesDocument>
  implements ISalesRepository {
  async findByCustomerId(customerId: string, limit: number = 10) {
    return this.model
      .find({ customer_id: customerId })
      .sort({ createdAt: -1 })
      .limit(limit);
  }
}

export default new SalesRepository(Sales);
