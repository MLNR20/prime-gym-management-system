import SessionAssignment, { ISessionAssignmentDocument } from "../models/sessionAssignment";
import GenericRepository from "./genericRepository";

export class SessionAssignmentRepository extends GenericRepository<ISessionAssignmentDocument> {}

export default new SessionAssignmentRepository(SessionAssignment);
