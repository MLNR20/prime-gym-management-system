import Session, { ISessionDocument } from "../models/session";
import GenericRepository from "./genericRepository";

export class SessionRepository extends GenericRepository<ISessionDocument> {
  async findByCustomerId(customerId: string, limit: number = 10) {
    return this.model
      .find({ customer_id: customerId })
      .sort({ created_at: -1 })
      .limit(limit);
  }

  async getTotalBalance(customerId: string): Promise<number> {
    const result = await this.model.aggregate([
      { $match: { customer_id: customerId } },
      { $group: { _id: null, total: { $sum: "$session_balance" } } },
    ]);
    return result[0]?.total ?? 0;
  }

  async deductSession(customerId: string, amount: number = 1) {
    const session = await this.model
      .findOne({ customer_id: customerId, session_balance: { $gte: amount } })
      .sort({ created_at: 1 });

    if (!session) return null;

    session.session_balance -= amount;
    await session.save();
    return session;
  }
}

export default new SessionRepository(Session);
