import { ICustomer, ICustomerDocument } from "../../models/customer";
import { IUnitOfWork, Repositories } from "../unitOfWork";

const COACHING_SUBSCRIPTION_TYPES = ["Coaching Subscription", "Monthly with Coaching"];
const COACHING_SESSION_BALANCE = 10;
const SEARCH_FIELDS = ["first_name", "last_name", "email", "subscription_type", "status"];

export class CustomerService {
  private unitOfWork: IUnitOfWork;

  constructor(unitOfWork: IUnitOfWork) {
    this.unitOfWork = unitOfWork;
  }

  private async awardCoachingSession(repositories: Repositories, customer_id: string, subscription_type: string): Promise<void> {
    if (!COACHING_SUBSCRIPTION_TYPES.includes(subscription_type)) return;
    await repositories.sessions.create({
      customer_id,
      created_at: new Date(),
      session_balance: COACHING_SESSION_BALANCE,
    });
  }

  async create(data: Partial<ICustomerDocument>) {
    return this.unitOfWork.run(async (repositories) => {
      const customer = await repositories.customers.create(data);
      await this.awardCoachingSession(repositories, String(customer._id), customer.subscription_type);
      return customer;
    });
  }

  async getAll() {
    return this.unitOfWork.customers.findAll();
  }

  async search(page: number, limit: number, search: string) {
    return this.unitOfWork.customers.search({ page, limit, search, fields: SEARCH_FIELDS });
  }

  async getById(id: string) {
    return this.unitOfWork.customers.findById(id);
  }

  async getStats() {
    const { customers } = this.unitOfWork;
    const [activeUsers, inactiveUsers, totalSum, monthlyTotalSum] = await Promise.all([
      customers.countUsersBasedOnTheirStatus("Paid"),
      customers.countUsersBasedOnTheirStatus("Expired"),
      customers.getTotalAmountPaid(),
      customers.retrievePaidCustomerAmountByMonth(),
    ]);
    return { activeUsers, inactiveUsers, totalSum, monthlyTotalSum };
  }

  async getAvailableForLockers(): Promise<ICustomer[]> {
    return this.unitOfWork.customers.findAvailableCustomerIds();
  }

  async update(id: string, data: Partial<ICustomerDocument>) {
    const changes = { ...data };
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    if (changes.subscription_type === "Daily Exercise") changes.expiration_Date = now;
    if (changes.subscription_type === "Monthly Subscription" || changes.subscription_type === "Monthly with Coaching") changes.expiration_Date = thirtyDaysFromNow;

    return this.unitOfWork.run(async (repositories) => {
      const existingCustomer = await repositories.customers.findById(id);
      const updatedCustomer = await repositories.customers.update(id, changes);
      if (!updatedCustomer) return null;

      if (changes.subscription_type && changes.subscription_type !== existingCustomer?.subscription_type) {
        await this.awardCoachingSession(repositories, String(updatedCustomer._id), changes.subscription_type);
      }
      return updatedCustomer;
    });
  }

  async softDelete(id: string) {
    return this.unitOfWork.customers.softDelete(id, true);
  }

  async delete(id: string) {
    return this.unitOfWork.customers.delete(id);
  }

  async getExpiredCustomers(): Promise<ICustomer[]> {
    return this.unitOfWork.customers.findSubscriptionStatus("Expired");
  }

  async getActiveCustomers(): Promise<ICustomer[]> {
    return this.unitOfWork.customers.findActivityStatus(false);
  }

  async getDeletedCustomers(): Promise<ICustomer[]> {
    return this.unitOfWork.customers.findActivityStatus(true);
  }

  async getPaidCustomers(): Promise<ICustomer[]> {
    return this.unitOfWork.customers.findSubscriptionStatus("Paid");
  }
  
  async retrieveMonthlyIncome(): Promise<Number>{
    return this.unitOfWork.customers.retrievePaidCustomerAmountByMonth();
  }

  async subscriptionsByMonth(): Promise<ICustomer[]>{
    return this.unitOfWork.customers.subscriptionsByMonth();
  }

  async renewSubscription(customer_id: string, payment_option: string, subscription_type: string, amount: number): Promise<void> {
    await this.unitOfWork.run(async (repositories) => {
      const customer = await repositories.customers.findById(customer_id);
      if (!customer) throw new Error(`Customer with id ${customer_id} not found`);
      if (customer.status === "Paid") throw new Error(`Customer status is currently paid`);

      const now = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      const renewal = { status: "Paid", amount_paid: amount, payment_option, subscription_type, payment_Date: now };
      if (subscription_type === "Monthly Subscription" || subscription_type === "Monthly with Coaching" || subscription_type === "Coaching Subscription") {
        await repositories.customers.updateSpecificDetails(customer_id, { ...renewal, expiration_Date: thirtyDaysFromNow });
      }
      if (subscription_type === "Daily Exercise") {
        await repositories.customers.updateSpecificDetails(customer_id, { ...renewal, expiration_Date: now });
      }

      await this.awardCoachingSession(repositories, customer_id, subscription_type);
      await repositories.subscriptionHistory.create({ subscription_type, customer_id, amount });
    });
  }
}
