import { ISessionAssignmentDocument } from "../../models/sessionAssignment";
import { IUnitOfWork } from "../unitOfWork";

export type AssignProgramResult =
  | { status: "success"; sessionBalance: number; assignment: ISessionAssignmentDocument; programName: string }
  | { status: "program_not_found" }
  | { status: "no_sessions" };

export class SessionAssignmentService {
  private unitOfWork: IUnitOfWork;

  constructor(unitOfWork: IUnitOfWork) {
    this.unitOfWork = unitOfWork;
  }

  /** Deducts one session and records the assignment together, or does neither. */
  async assignProgram(customerId: string, programId: string): Promise<AssignProgramResult> {
    return this.unitOfWork.run(async ({ programs, sessions, sessionAssignments }): Promise<AssignProgramResult> => {
      const program = await programs.findById(programId);
      if (!program) return { status: "program_not_found" };

      const deducted = await sessions.deductSession(customerId, 1);
      if (!deducted) return { status: "no_sessions" };

      const sessionBalance = await sessions.getTotalBalance(customerId);

      const assignment = await sessionAssignments.create({
        customer_id: customerId,
        program_id: programId,
        session_balance_after: sessionBalance,
        assigned_at: new Date(),
      });

      return { status: "success", sessionBalance, assignment, programName: program.program_name };
    });
  }

  async getHistory(page: number, limit: number, search: string) {
    const pipeline = [
      {
        $addFields: {
          customerObjectId: { $toObjectId: "$customer_id" },
          programObjectId: { $toObjectId: "$program_id" },
        },
      },
      {
        $lookup: {
          from: "Customer",
          localField: "customerObjectId",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "Program",
          localField: "programObjectId",
          foreignField: "_id",
          as: "program",
        },
      },
      { $unwind: { path: "$program", preserveNullAndEmptyArrays: true } },
      { $sort: { assigned_at: -1 as const } },
      {
        $project: {
          _id: 1,
          first_name: "$customer.first_name",
          last_name: "$customer.last_name",
          program_name: "$program.program_name",
          session_balance_after: 1,
          assigned_at: 1,
          createdAt: 1,
        },
      },
    ];

    return this.unitOfWork.sessionAssignments.paginateWithLookup({
      page,
      limit,
      pipeline,
      search,
      fields: ["first_name", "last_name", "program_name"],
    });
  }
}
