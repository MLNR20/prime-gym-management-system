import SubscriptionHistory, { ISubscriptionHistoryDocument } from "../models/subscription_history";
import GenericRepository from "./genericRepository";

export class SubscriptionHistoryRepository extends GenericRepository<ISubscriptionHistoryDocument> {
    
}

export default new SubscriptionHistoryRepository(SubscriptionHistory);
