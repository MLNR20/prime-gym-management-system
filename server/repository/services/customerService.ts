// src/services/authService.ts
import { CustomerRepository } from "../customerRepository";
import { ICustomer } from "../../models/customer";
import LogsRepository from "../../repository/logsRepository";

export class CustomerService {
  private customerRepository: CustomerRepository;

  constructor(customerRepository: CustomerRepository) {
    this.customerRepository = customerRepository;
  }

   async getExpiredCustomers(): Promise<ICustomer[]> {
      return this.customerRepository.findSubscriptionStatus("Expired");
   }

   async getPaidCustomers(): Promise<ICustomer[]> {
        return this.customerRepository.findSubscriptionStatus("Paid");
    }

}


