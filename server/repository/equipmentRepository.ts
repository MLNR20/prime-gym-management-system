import Equipment, { IEquipmentDocument} from "../models/equipment";
import GenericRepository from "./genericRepository";
import { IEquipmentRepository } from "./interface/equipmentRepositoryInterface";

export class EquipmentRepository extends GenericRepository<IEquipmentDocument> implements IEquipmentRepository
{
    
}


export default new EquipmentRepository(Equipment);
