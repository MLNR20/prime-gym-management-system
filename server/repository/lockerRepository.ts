import Locker, { ILockerDocument } from "../models/locker";
import GenericRepository from "./genericRepository";
import { ILockerRepository } from "./interface/lockerRepositoryInterface";
import lockerAssignmentRepository from "./lockerAssignmentRepository";

export class LockerRepository extends GenericRepository<ILockerDocument> implements ILockerRepository
{
    async findActiveLockerDocument(is_active: Boolean): Promise<ILockerDocument[] | null> {
       return this.model.find({ is_active });
    }

    async findAvailableLockers(): Promise<ILockerDocument[]> {
        const borrowedLockerIds = await lockerAssignmentRepository.getAvailableLockerIds();

        return this.model.find({
            is_active: true,
            _id: { $nin: borrowedLockerIds }
        }).select("id locker_number is_active");
    }
   
}

export default new LockerRepository(Locker);
