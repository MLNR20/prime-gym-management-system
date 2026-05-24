import Program, { IProgramDocument } from "../models/program";
import GenericRepository from "./genericRepository";

export class ProgramRepository extends GenericRepository<IProgramDocument> {
  async findAllWithExercises() {
    return this.model.find().populate("exercises").exec();
  }
}

export default new ProgramRepository(Program);
