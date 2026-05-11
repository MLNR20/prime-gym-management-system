import GenericRepository from "./genericRepository";
import Admin, { IAdmin } from "../models/admin";

export class AdminRepository extends GenericRepository<IAdmin> {
  protected hiddenFields = ["password", "username", "__v"];

  async deactivateAccount(user_id: string) {
    return this.model.updateOne({ _id: user_id }, { $set: { isDeleted: true } });
  }
}

export default new AdminRepository(Admin);
