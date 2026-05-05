import GenericRepository from "./genericRepository";
import Admin, {IAdmin} from "../models/admin"

export class AdminRepository extends GenericRepository<IAdmin>
{

}  

export default new AdminRepository(Admin);