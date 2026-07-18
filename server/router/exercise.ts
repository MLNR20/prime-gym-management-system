import express from "express";
import ExerciseRepository from "../repository/exerciseRepository";
import LogsRepository from "../repository/logsRepository";
import { authMiddleware } from "../middleware/middleware";
import { RequestWithUser } from "../middleware/types/express";

import exerciseRepository from "../repository/exerciseRepository";

const exerciseRouter = express.Router();
//const customerService = new CustomerService(CustomerRepository);

// CREATE
exerciseRouter.post("/", authMiddleware, async (request: RequestWithUser, response) => {
  try {
    const newExercise = {
      exercise_name: request.body.exercise_name,
      target_area: request.body.target_area,
      reps: request.body.reps,
      sets: request.body.sets,
    };
    const admin = request.admin;
    await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} created exercise called ${request.body.target_area}, called ${request.body.exercise_name} at ${new Date().toISOString()}`);

    const createNewExercise = await ExerciseRepository.create(newExercise);
    return response.status(201).send(createNewExercise);
  } catch (error) {
    console.log(error);
  }
});

// READ ALL
exerciseRouter.get("/", authMiddleware, async (request: RequestWithUser, response) => {
  try {
    const exercises = await ExerciseRepository.findAll();
    const admin = request.admin;
    await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} requested exercise list at ${new Date().toISOString()}`);
    response.status(200).json(exercises);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error fetching exercises" });
  }
});

// PAGINATED EXERCISE LIST
exerciseRouter.get("/show/", authMiddleware, async (request: RequestWithUser, response) => {
  try {
    const limit = parseInt(request.query.limit as string) || 10;
    const page = parseInt(request.query.page as string) || 1;
    const search = (request.query.search as string) || "";

    const result = await ExerciseRepository.search({
      page,
      limit,
      search,
      fields: ["exercise_name", "target_area"],
    });

    const admin = request.admin;
    await LogsRepository.logAction(
      admin!._id.toString(),
      `${admin!.first_name} ${admin?.last_name} accessed exercises list at ${new Date().toISOString()}`,
    );

    response.status(200).json(result);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error fetching exercises" });
  }
});


//RETRIEVE EXERCISE FOR EDITING
exerciseRouter.get("/:id", authMiddleware, async (request: RequestWithUser, response) => {
  try {
    const retrieveExercise = await ExerciseRepository.findById(request.params.id!)

    if (!retrieveExercise) {
      return response.status(404).json({ message: "Failed to retrieve exercise" })
    }

    const admin = request.admin;
    await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} retrieved exercise at ${new Date().toISOString()}`);
    response.status(200).json(retrieveExercise);
  }
  catch (error) {
    response.status(500).json({ message: "Error fetching exercise" })
  }
})


// UPDATE
exerciseRouter.put("/:id", authMiddleware, async (request: RequestWithUser, response) => {
  try {
    const updatedCustomer = await ExerciseRepository.update(
      request.params.id!,
      request.body
    );

    if (!updatedCustomer) {
      return response.status(404).json({ message: "Exercise not found" });
    }

    const admin = request.admin;
    await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} updated exercise and called ${request.body.exercise_name} changed it's details at ${new Date().toISOString()}`);
    response.status(200).json(updatedCustomer);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error updating exercise" });
  }
});


//DELETE
exerciseRouter.delete("/:id", authMiddleware, async (request: RequestWithUser, response) => {
  try {
    const deletedCustomer = await ExerciseRepository.delete(request.params.id!);
    if (!deletedCustomer) {
      return response.status(404).json({ message: "Exercise not found" });
    }

    const admin = request.admin;
    await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} deleted exercise at ${new Date().toISOString()}`);

    response.status(204).json({ message: "Exercise deleted successfully" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error deleting exercise" });
  }
});


// SOFT DELETE
exerciseRouter.patch("/:id", authMiddleware, async (request: RequestWithUser, response) => {
  try {
    const deletedCustomer = await exerciseRepository.softDelete(request.params.id!, true);
    if (!deletedCustomer) {
      return response.status(404).json({ message: "Customer not found" });
    }

    const admin = request.admin;
    await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} deleted exercise at ${new Date().toISOString()}`);

    response.status(200).json({ message: "Exercise deleted successfully" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error deleting customer" });
  }
});


exerciseRouter.post("/many/", authMiddleware, async (request: RequestWithUser, response) => {
  try {
    const docs = await ExerciseRepository.createMany(request.body);

    const admin = request.admin;
    await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} inserted many exercises at ${new Date().toISOString()}`);

    response.status(201).json(docs);
  } catch (err: any) {
    response.status(400).json({ error: err.message });
  }
});

export default exerciseRouter;
