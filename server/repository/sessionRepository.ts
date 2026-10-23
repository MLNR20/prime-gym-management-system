import Session, { ISessionDocument } from "../models/session";
import GenericRepository from "./genericRepository";

export class SessionRepository extends GenericRepository<ISessionDocument> {
  async findByCustomerId(customerId: string, limit: number = 10) {
    return this.model
      .find({ customer_id: customerId })
      .session(this.dbSession)
      .sort({ created_at: -1 })
      .limit(limit);
  }

  async getTotalBalance(customerId: string): Promise<number> {
    const result = await this.model
      .aggregate([
        { $match: { customer_id: customerId } },
        { $group: { _id: null, total: { $sum: "$session_balance" } } },
      ])
      .session(this.dbSession);
    return result[0]?.total ?? 0;
  }

  // Takes from the oldest session that still has enough balance, in one atomic step.
  async deductSession(customerId: string, amount: number = 1) {
    return this.model.findOneAndUpdate(
      { customer_id: customerId, session_balance: { $gte: amount } },
      { $inc: { session_balance: -amount } },
      { new: true, sort: { created_at: 1 }, session: this.dbSession },
    );
  }
}

export default new SessionRepository(Session);
