import Customer, { ICustomer, ICustomerDocument } from "../models/customer";
import GenericRepository from "./genericRepository";
import { ICustomerRepository } from "./interface/customerRepositoryInterface";
import lockerAssignmentRepository from "./lockerAssignmentRepository";

export class CustomerRepository extends GenericRepository<ICustomerDocument> implements ICustomerRepository {
  async findByFirstName(first_name: string): Promise<ICustomerDocument | null> {
    return this.model.findOne({ first_name });
  }

  async findSubscriptionStatus(status: string): Promise<ICustomerDocument[]> {
    return this.model.find({ status });
  }

  async countUsersBasedOnTheirStatus(status: string): Promise<Number> {
    return this.model.countDocuments({ status, isDeleted: false });
  }

  async subscriptionsByMonth(): Promise<ICustomerDocument[]> {
    const result = await this.model.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$payment_Date" },
            month: { $month: "$payment_Date" },
            subscriptionType: "$subscription_type",
          },
          total: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);
    return result;
  }

  async retrievePaidCustomerAmountByMonth(): Promise<number> {
    const dateNow = new Date();
    const date30DaysAgo = new Date();
    date30DaysAgo.setDate(dateNow.getDate() - 30);

    const result = await this.model.aggregate([
      {
        $match: {
          payment_Date: {
            $gte: date30DaysAgo,
            $lte: dateNow,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount_paid" },
        },
      },
    ]);

    return result[0]?.totalAmount ?? 0;
  }

  async findAvailableCustomerIds(): Promise<ICustomer[]> {
    const borrowedUserLockerIds = await lockerAssignmentRepository.getActiveCustomerIds();

    return this.model
      .find({
        isDeleted: false,
        status: "Paid",
        _id: { $nin: borrowedUserLockerIds },
      })
      .select("id customer_id first_name last_name isDeleted status");
  }

  async getTotalAmountPaid(): Promise<number> {
    const result = await this.model.aggregate([
      { $group: { _id: null, total: { $sum: "$amount_paid" } } },
    ]);
    return result[0]?.total ?? 0;
  }

  async findActivityStatus(status: Boolean): Promise<ICustomer[]> {
    return this.model.find({ status });
  }

  async findByLastName(last_name: string): Promise<ICustomerDocument | null> {
    return this.model.findOne({ last_name });
  }

  async findCoachingCustomers(): Promise<ICustomerDocument[]> {
    return this.model.find({
      isDeleted: false,
      subscription_type: { $in: ["Coaching Subscription", "Monthly with Coaching"] },
    });
  }
}

export default new CustomerRepository(Customer);
