import Customer, { ICustomer, ICustomerDocument } from "../models/customer";
import GenericRepository from "./genericRepository";
import {ICustomerRepository} from "./interface/customerRepositoryInterface"

export class CustomerRepository extends GenericRepository<ICustomerDocument> implements ICustomerRepository {
  
  async findByFirstName(first_name: string): Promise<ICustomerDocument | null> {
    return this.model.findOne({ first_name });
  }

  async findSubscriptionStatus(status: string): Promise<ICustomerDocument[]> {
    return this.model.find({ status });
  }

  async countUsersBasedOnTheirStatus(status: string): Promise<Number>{
    return this.model.countDocuments({status});
  }

 async getTotalAmountPaid(): Promise<number> {
  const result = await this.model.aggregate([
    { $group: { _id: null, total: { $sum: "$amount_paid" } } }
  ]);
  return result[0]?.total ?? 0;
}

  async findActivityStatus(status: Boolean): Promise<ICustomer[]> {
      return this.model.find({status});
  }

  async findByLastName(last_name:string): Promise<ICustomerDocument |null>{
    return this.model.findOne({last_name});
  }
}

export default new CustomerRepository(Customer);
