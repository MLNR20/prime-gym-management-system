import Sales, { ISalesDocument } from "../models/sales";
import GenericRepository from "./genericRepository";
import { ISalesRepository } from "./interface/salesRepositoryInterface";

export class SalesRepository
  extends GenericRepository<ISalesDocument>
  implements ISalesRepository {}

export default new SalesRepository(Sales);
