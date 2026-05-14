import { ICustomer } from "../../models/customer";

export interface ICustomerRepository {
  findByFirstName(first_name:string): Promise<ICustomer | null>;
  findSubscriptionStatus(status: string): Promise<ICustomer[]>;
  findActivityStatus(status:Boolean): Promise<ICustomer[]>;
  findByLastName(last_name: string): Promise<ICustomer | null>;
  findAvailableCustomerIds(): Promise<ICustomer[]>;
}

