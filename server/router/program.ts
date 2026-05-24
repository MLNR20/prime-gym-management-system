import express from "express";
import ProgramRepository from "../repository/programRepository";
import LogsRepository from "../repository/logsRepository";
import { authMiddleware } from "../middleware/middleware";
import { RequestWithUser } from "../middleware/types/express";
import ProgramAndExercisesRepository from "../repository/programAndExercisesRepository";

const programRouter = express.Router();

// CREATE
programRouter.post("/", authMiddleware, async (request: RequestWithUser, response) => {
  try {
    const newProgram = {
      program_name: request.body.program_name,
      description: request.body.description,
      date_assigned: request.body.date_assigned,
    };
    const admin = request.admin;
    await LogsRepository.logAction(
      admin!._id.toString(),
      `${admin!.first_name} ${admin?.last_name} created program called ${request.body.program_name} at ${new Date().toISOString()}`,
    );

    const createNewProgram = await ProgramRepository.create(newProgram);
    return response.status(201).send(createNewProgram);
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Error creating program" });
  }
});

// READ ALL
programRouter.get("/", authMiddleware, async (request: RequestWithUser, response) => {
  try {
    const programs = await ProgramRepository.findAll();
    const admin = request.admin;
    await LogsRepository.logAction(
      admin!._id.toString(),
      `${admin!.first_name} ${admin?.last_name} requested program list at ${new Date().toISOString()}`,
    );
    response.status(200).json(programs);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error fetching programs" });
  }
});

// PAGINATED PROGRAM LIST
programRouter.get("/show/", authMiddleware, async (request: RequestWithUser, response) => {
  try {
    const limit = parseInt(request.query.limit as string) || 10;
    const page = parseInt(request.query.page as string) || 1;
    const search = (request.query.search as string) || "";

    const result = await ProgramRepository.search({
      page,
      limit,
      search,
      fields: ["program_name", "description"],
    });

    const admin = request.admin;
    await LogsRepository.logAction(
      admin!._id.toString(),
      `${admin!.first_name} ${admin?.last_name} accessed programs list at ${new Date().toISOString()}`,
    );

    response.status(200).json(result);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error fetching programs" });
  }
});

// RETRIEVE PROGRAM FOR EDITING
programRouter.get("/:id", authMiddleware, async (request: RequestWithUser, response) => {
  try {
    const retrieveProgram = await ProgramRepository.findById(request.params.id!);

    if (!retrieveProgram) {
      return response.status(404).json({ message: "Failed to retrieve program" });
    }

    const admin = request.admin;
    await LogsRepository.logAction(
      admin!._id.toString(),
      `${admin!.first_name} ${admin?.last_name} retrieved program at ${new Date().toISOString()}`,
    );
    response.status(200).json(retrieveProgram);
  } catch (error) {
    response.status(500).json({ message: "Error fetching program" });
  }
});

// UPDATE
programRouter.put("/:id", authMiddleware, async (request: RequestWithUser, response) => {
  try {
    const updatedProgram = await ProgramRepository.update(request.params.id!, request.body);

    if (!updatedProgram) {
      return response.status(404).json({ message: "Program not found" });
    }

    const admin = request.admin;
    await LogsRepository.logAction(
      admin!._id.toString(),
      `${admin!.first_name} ${admin?.last_name} updated program called ${request.body.program_name} at ${new Date().toISOString()}`,
    );
    response.status(200).json(updatedProgram);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error updating program" });
  }
});

// DELETE
programRouter.delete("/:id", authMiddleware, async (request: RequestWithUser, response) => {
  try {
    const deletedProgram = await ProgramRepository.delete(request.params.id!);

    if (!deletedProgram) {
      return response.status(404).json({ message: "Program not found" });
    }

    const admin = request.admin;
    await LogsRepository.logAction(
      admin!._id.toString(),
      `${admin!.first_name} ${admin?.last_name} deleted program at ${new Date().toISOString()}`,
    );

    response.status(200).json(deletedProgram);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error deleting program" });
  }
});

// EXPORT PROGRAMS WITH ASSIGNED EXERCISES
programRouter.get("/export", authMiddleware, async (request: RequestWithUser, response) => {
  try {
    const programs = await ProgramRepository.findAllWithExercises();
    const rows: string[] = [];
    const header = [
      "program_id",
      "program_name",
      "description",
      "date_assigned",
      "program_createdAt",
      "program_updatedAt",
      "exercise_id",
      "exercise_name",
      "target_area",
      "reps",
      "sets",
      "exercise_createdAt",
      "exercise_updatedAt",
    ];

    rows.push(header.join(","));

    programs.forEach((program) => {
      const exercises = Array.isArray(program.exercises) ? program.exercises : [];
      if (exercises.length === 0) {
        rows.push([
          program._id,
          `"${String(program.program_name).replace(/"/g, '""')}"`,
          `"${String(program.description).replace(/"/g, '""')}"`,
          program.date_assigned ? new Date(program.date_assigned).toISOString() : "",
          program.createdAt ? new Date(program.createdAt).toISOString() : "",
          program.updatedAt ? new Date(program.updatedAt).toISOString() : "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ].join(","));
      } else {
        exercises.forEach((exercise: any) => {
          rows.push([
            program._id,
            `"${String(program.program_name).replace(/"/g, '""')}"`,
            `"${String(program.description).replace(/"/g, '""')}"`,
            program.date_assigned ? new Date(program.date_assigned).toISOString() : "",
            program.createdAt ? new Date(program.createdAt).toISOString() : "",
            program.updatedAt ? new Date(program.updatedAt).toISOString() : "",
            exercise?._id ?? "",
            exercise?.exercise_name ? `"${String(exercise.exercise_name).replace(/"/g, '""')}"` : "",
            exercise?.target_area ? `"${String(exercise.target_area).replace(/"/g, '""')}"` : "",
            exercise?.reps ?? "",
            exercise?.sets ?? "",
            exercise?.createdAt ? new Date(exercise.createdAt).toISOString() : "",
            exercise?.updatedAt ? new Date(exercise.updatedAt).toISOString() : "",
          ].join(","));
        });
      }
    });

    const csv = rows.join("\n");
    response.setHeader("Content-Type", "text/csv;charset=utf-8");
    response.setHeader("Content-Disposition", "attachment; filename=programs_exercises.csv");
    response.send(csv);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error exporting programs" });
  }
});

// GET ASSIGNED EXERCISES FOR A PROGRAM
programRouter.get("/:id/exercises", authMiddleware, async (request: RequestWithUser, response) => {
  try {
    const programId = request.params.id!;
    const exercises = await ProgramAndExercisesRepository.findByProgram(programId);

    const admin = request.admin;
    await LogsRepository.logAction(
      admin!._id.toString(),
      `${admin!.first_name} ${admin?.last_name} requested exercises for program ${programId} at ${new Date().toISOString()}`,
    );

    response.status(200).json(exercises);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error fetching assigned exercises" });
  }
});

// ASSIGN EXERCISE TO PROGRAM
programRouter.post("/:id/exercises", authMiddleware, async (request: RequestWithUser, response) => {
  try {
    const programId = request.params.id!;
    const { exercise_id } = request.body;

    if (!exercise_id) return response.status(400).json({ message: "exercise_id required" });

    const assigned = await ProgramAndExercisesRepository.assign(programId, exercise_id);

    const admin = request.admin;
    await LogsRepository.logAction(
      admin!._id.toString(),
      `${admin!.first_name} ${admin?.last_name} assigned exercise ${exercise_id} to program ${programId} at ${new Date().toISOString()}`,
    );

    response.status(201).json(assigned);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error assigning exercise" });
  }
});

// UNASSIGN EXERCISE FROM PROGRAM
programRouter.delete("/:id/exercises/:exerciseId", authMiddleware, async (request: RequestWithUser, response) => {
  try {
    const programId = request.params.id!;
    const exerciseId = request.params.exerciseId!;

    const removed = await ProgramAndExercisesRepository.unassign(programId, exerciseId);

    const admin = request.admin;
    await LogsRepository.logAction(
      admin!._id.toString(),
      `${admin!.first_name} ${admin?.last_name} removed exercise ${exerciseId} from program ${programId} at ${new Date().toISOString()}`,
    );

    response.status(200).json({ removed });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error removing exercise" });
  }
});

export default programRouter;
