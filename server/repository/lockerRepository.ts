import Locker, { ILockerDocument } from "../models/locker";
import GenericRepository from "./genericRepository";
import { ILockerRepository } from "./interface/lockerRepositoryInterface";

export class LockerRepository extends GenericRepository<ILockerDocument> implements ILockerRepository
{
    async findActiveLockerDocument(is_active: Boolean): Promise<ILockerDocument[] | null> {
       return this.model.find({ is_active });
    }
   
}

export default new LockerRepository(Locker);
