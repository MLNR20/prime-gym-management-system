import Logs, { ILogsDocument } from "../models/logs";
import GenericRepository from "./genericRepository";

class SubscriptionHistoryRepository extends GenericRepository<ILogsDocument> {
  async logAction(adminId: string, message: string): Promise<ILogsDocument> {
    return this.model.create({
      admin_id: adminId,
      logs: message,
    });
  }
}

export default new SubscriptionHistoryRepository(Logs);
