import Locker, { ILockerDocument } from "../models/locker";
import GenericRepository from "./genericRepository";

export class LockerRepository extends GenericRepository<ILockerDocument> 
{
    
}


export default new LockerRepository(Locker);
