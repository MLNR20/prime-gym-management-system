import Locker, { ILockerDocument } from "../models/locker";
import GenericRepository from "./genericRepository";
import { ILockerRepository } from "./interface/lockerRepositoryInterface";

export class LockerRepository extends GenericRepository<ILockerDocument> implements ILockerRepository
{
    
}


export default new LockerRepository(Locker);
