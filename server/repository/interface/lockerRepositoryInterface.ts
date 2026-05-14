import { ILocker, ILockerDocument } from "../../models/locker";

export interface ILockerRepository {  

    findActiveLockerDocument(is_active: Boolean) : Promise<ILockerDocument[]| null>;

}