import { IUnitOfWork } from "../unitOfWork";

export class SessionService {
  private unitOfWork: IUnitOfWork;

  constructor(unitOfWork: IUnitOfWork) {
    this.unitOfWork = unitOfWork;
  }

  async search(page: number, limit: number, search: string, customerId: string) {
    const pipeline = [
      ...(customerId ? [{ $match: { customer_id: customerId } }] : []),
      {
        $addFields: {
          customer_id: { $toObjectId: "$customer_id" },
        },
      },
      {
        $lookup: {
          from: "Customer",
          localField: "customer_id",
          foreignField: "_id",
          as: "customer",
        },
      },
      {
        $unwind: {
          path: "$customer",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          customer_id: 1,
          session_balance: 1,
          created_at: 1,
          first_name: { $ifNull: ["$customer.first_name", "N/A"] },
          last_name: { $ifNull: ["$customer.last_name", ""] },
        },
      },
    ];

    return this.unitOfWork.sessions.paginateWithLookup({
      page,
      limit,
      pipeline,
      search,
      fields: ["first_name", "last_name"],
    });
  }

  async getCoachingCustomers() {
    const customers = await this.unitOfWork.customers.findCoachingCustomers();

    return Promise.all(
      customers.map(async (customer: any) => ({
        _id: customer._id,
        first_name: customer.first_name,
        last_name: customer.last_name,
        subscription_type: customer.subscription_type,
        status: customer.status,
        session_balance: await this.unitOfWork.sessions.getTotalBalance(String(customer._id)),
      }))
    );
  }

  /** Deducts one session and returns the new balance, or null when none are left. */
  async assign(customerId: string): Promise<number | null> {
    return this.unitOfWork.run(async ({ sessions }) => {
      const deducted = await sessions.deductSession(customerId, 1);
      if (!deducted) return null;

      return sessions.getTotalBalance(customerId);
    });
  }

  async getByCustomerId(customerId: string, limit: number) {
    const sessions = await this.unitOfWork.sessions.findByCustomerId(customerId, limit);

    return Promise.all(
      sessions
        .map((session) => (session.toObject ? session.toObject() : session))
        .map(async (session: any) => {
          const customer = session.customer_id
            ? await this.unitOfWork.customers.findById(session.customer_id)
            : null;
          return {
            ...session,
            first_name: customer?.first_name ?? "N/A",
            last_name: customer?.last_name ?? "",
          };
        })
    );
  }
}
