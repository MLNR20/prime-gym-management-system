import Customer, { ICustomerDocument } from "../models/customer";
import GenericRepository from "./genericRepository";

class CustomerRepository extends GenericRepository<ICustomerDocument> {
  
  async findByFirstName(first_name: string): Promise<ICustomerDocument | null> {
    return this.model.findOne({ first_name });
  }

  async findByLastName(last_name:string): Promise<ICustomerDocument |null>{
    return this.model.findOne({last_name});
  }
}

export default new CustomerRepository(Customer);
