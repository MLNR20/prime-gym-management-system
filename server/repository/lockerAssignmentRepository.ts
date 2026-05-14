import ILockerAssignment, { ILockerAssignmentDocument} from "../models/lockerassignment";
import GenericRepository from "./genericRepository";

export class LockerAssignmentRepository extends GenericRepository<ILockerAssignmentDocument> 
{
    async preventDuplicateBorrows (customer_id:String, locker_id:String) : Promise<number>
    {
        const count = await this.model.countDocuments({
            customer_id,
            locker_id,
            status: "Borrowed"
        });
        return count || 0;
    }

    async getAvailableLockerIds(): Promise<String[]> {
        return this.model.distinct("locker_id", {
            status: "Borrowed"
        });
    }

    async findAvailableLockers(): Promise<ILockerAssignmentDocument[]> {
        return this.model.find({
            status: { $ne: "Borrowed" }
        });
    }
}


export default new LockerAssignmentRepository(ILockerAssignment);
