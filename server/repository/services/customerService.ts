// src/services/authService.ts
import { CustomerRepository } from "../customerRepository";
import { ICustomer } from "../../models/customer";
import LogsRepository from "../../repository/logsRepository";
import {SubscriptionHistoryRepository} from "../../repository/subscriptionhistoryRepository"
import { SessionRepository } from "../../repository/sessionRepository";

const COACHING_SUBSCRIPTION_TYPES = ["Coaching Subscription", "Monthly with Coaching"];
const COACHING_SESSION_BALANCE = 10;

export class CustomerService {
  private customerRepository: CustomerRepository;
  private subscriptionRepository: SubscriptionHistoryRepository;
  private sessionRepository: SessionRepository;

  constructor(customerRepository: CustomerRepository, subscriptionRepository: SubscriptionHistoryRepository, sessionRepository: SessionRepository) {
    this.customerRepository = customerRepository;
    this.subscriptionRepository = subscriptionRepository;
    this.sessionRepository = sessionRepository;
  }

  async awardCoachingSession(customer_id: string, subscription_type: string): Promise<void> {
    if (!COACHING_SUBSCRIPTION_TYPES.includes(subscription_type)) return;
    await this.sessionRepository.create({
      customer_id,
      created_at: new Date(),
      session_balance: COACHING_SESSION_BALANCE,
    });
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

  async updateSubscription(customer_id: string, payment_option:string ,subscription_type_details: string, amount: number) : Promise<void> {
    const check_customer_id = await this.customerRepository.findById(customer_id);
    const thirtyDaysFromNow = new Date();
    const now  = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    if(!check_customer_id) throw new Error(`Customer with id ${customer_id} not found`);
    if(check_customer_id.status === "Paid") throw new Error(`Customer status is currently paid`);
    if(subscription_type_details==="Monthly Subscription" || subscription_type_details==="Monthly with Coaching" || subscription_type_details==="Coaching Subscription") await this.customerRepository.updateSpecificDetails(customer_id, {status: "Paid", amount_paid: amount, payment_option:payment_option, subscription_type:subscription_type_details, payment_Date: now , expiration_Date: thirtyDaysFromNow});
    if(subscription_type_details==="Daily Exercise") await this.customerRepository.updateSpecificDetails(customer_id, {status: "Paid", amount_paid: amount, payment_option:payment_option, subscription_type:subscription_type_details, payment_Date: now , expiration_Date: now});
    await this.awardCoachingSession(customer_id, subscription_type_details);
  }

  async createSubscriptionHistory(customer_id: string, subscription_type: string, amount: number) : Promise<void> {
    const check_customer_id = await this.customerRepository.findById(customer_id);
    if(!check_customer_id) throw new Error(`Customer with id ${customer_id} not found`); 
    await this.subscriptionRepository.create({subscription_type:subscription_type, customer_id: customer_id, amount: amount})
  }
}
