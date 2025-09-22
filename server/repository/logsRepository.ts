import Logs, { ILogsDocument } from "../models/logs";
import GenericRepository from "./genericRepository";

class LogsRepository extends GenericRepository<ILogsDocument> {
  
  async findByFirstName(first_name: string): Promise<ILogsDocument | null> {
    return this.model.findOne({ first_name });
  }

  async findByLastName(last_name:string): Promise<ILogsDocument |null>{
    return this.model.findOne({last_name});
  }
}

export default new LogsRepository(Logs);
