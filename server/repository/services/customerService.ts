// src/services/authService.ts
import { CustomerRepository } from "../customerRepository";
import { ICustomer } from "../../models/customer";
import LogsRepository from "../../repository/logsRepository";
import {SubscriptionHistoryRepository} from "../../repository/subscriptionhistoryRepository"

export class CustomerService {
  private customerRepository: CustomerRepository;
  private subscriptionRepository: SubscriptionHistoryRepository;

  constructor(customerRepository: CustomerRepository, subscriptionRepository: SubscriptionHistoryRepository) {
    this.customerRepository = customerRepository;
    this.subscriptionRepository = subscriptionRepository;
  }

  async getExpiredCustomers(): Promise<ICustomer[]> {
    return this.customerRepository.findSubscriptionStatus("Expired");
  }

  async getActiveCustomers(): Promise<ICustomer[]> {
    return this.customerRepository.findActivityStatus(false);
  }

  async getDeletedCustomers(): Promise<ICustomer[]> {
    return this.customerRepository.findActivityStatus(true);
  }

  async getPaidCustomers(): Promise<ICustomer[]> {
    return this.customerRepository.findSubscriptionStatus("Paid");
  }
  
  async retrieveMonthlyIncome(): Promise<Number>{
    return this.customerRepository.retrievePaidCustomerAmountByMonth();
  }

  async subscriptionsByMonth(): Promise<ICustomer[]>{
    return this.customerRepository.subscriptionsByMonth();
  }

  async createSubscriptionHistory(customer_id: string, subscription_type: string, amount: number) : Promise<void> {

    const check_customer_id = await this.customerRepository.findById(customer_id);

    

    if(!check_customer_id) throw new Error(`Customer with id ${customer_id} not found`); 

    if(check_customer_id.status === "Paid") throw new Error(`Customer status is currently paid`);

    await this.subscriptionRepository.create({subscription_type:subscription_type, customer_id: customer_id, amount: amount})
  }
}
