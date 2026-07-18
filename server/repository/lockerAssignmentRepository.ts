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


    async getActiveCustomerIds(): Promise<String[]> {
       return this.model.distinct("customer_id", {
            status: "Borrowed",
        });
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

    async dailyAttendanceCounts(days: number = 30): Promise<{ date: string; count: number }[]> {
        const results = await this.model.aggregate([
            {
                $addFields: {
                    dateSource: { $ifNull: ["$time_in", "$createdAt"] },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$dateSource" },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: -1 } },
            { $limit: days },
            { $sort: { _id: 1 } },
            {
                $project: { _id: 0, date: "$_id", count: 1 },
            },
        ]);
        return results;
    }

    async totalAttendanceCount(): Promise<number> {
        return this.model.countDocuments({});
    }
}


export default new LockerAssignmentRepository(ILockerAssignment);
