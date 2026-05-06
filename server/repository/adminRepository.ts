import GenericRepository from "./genericRepository";
import Admin, {IAdmin} from "../models/admin"

export class AdminRepository extends GenericRepository<IAdmin>
{
  protected hiddenFields = [
    "password",
    "username",
    "__v",
  ];

}  

export default new AdminRepository(Admin);