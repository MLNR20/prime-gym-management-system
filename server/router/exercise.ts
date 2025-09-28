import express from "express";
import ExerciseRepository from "../repository/exerciseRepository";
import LogsRepository from "../repository/logsRepository";
import { CustomerService } from "../repository/services/customerService";
import { authMiddleware } from "../middleware/middleware";
import { RequestWithUser } from "../middleware/types/express";

import exerciseRepository from "../repository/exerciseRepository";

const exerciseRouter = express.Router();
//const customerService = new CustomerService(CustomerRepository);

// CREATE
exerciseRouter.post("/", authMiddleware, async (request:RequestWithUser, response) => {
  try {
    const newExercise = {
      exercise_name: request.body.exercise_name,
      target_area: request.body.target_area,
      reps: request.body.reps,
      sets: request.body.sets,
    };

    const createNewExercise = await ExerciseRepository.create(newExercise);
    //const admin = request.admin; 
    //await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} created new user at ${new Date().toISOString()}`);
    
    return response.status(200).send(createNewExercise);
  } catch (error) {
    console.log(error);
  }
});

// READ ALL
exerciseRouter.get("/", authMiddleware, async (request:RequestWithUser, response) => {
  try {
    const exercises = await ExerciseRepository.findAll();
    response.json(exercises);

    //const admin = request.admin; 
    //await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} created new user at ${new Date().toISOString()}`);

  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error fetching exercises" });
  }
});

// UPDATE
exerciseRouter.put("/:id", authMiddleware, async (request:RequestWithUser, response) => {
  try {
    const updatedCustomer = await ExerciseRepository.update(
      request.params.id!,
      request.body
    );
    if (!updatedCustomer) {
      return response.status(404).json({ message: "Exercise not found" });
    }

    //const admin = request.admin; 
    //await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} created new user at ${new Date().toISOString()}`);

    response.json(updatedCustomer);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error updating customer" });
  }
});


//DELETE
exerciseRouter.delete("/:id", authMiddleware, async (request:RequestWithUser, response) => {
  try {
    const deletedCustomer = await ExerciseRepository.delete(request.params.id!);
    if (!deletedCustomer) {
      return response.status(404).json({ message: "Customer not found" });
    }

    //const admin = request.admin; 
    //await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} created new user at ${new Date().toISOString()}`);

    response.json({ message: "Exercise deleted successfully" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error deleting customer" });
  }
});


// SOFT DELETE
exerciseRouter.patch("/:id", authMiddleware, async (request:RequestWithUser, response) => {
  try {
    const deletedCustomer = await exerciseRepository.softDelete(request.params.id!, true);
    if (!deletedCustomer) {
      return response.status(404).json({ message: "Customer not found" });
    }

    //const admin = request.admin; 
    //await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} created new user at ${new Date().toISOString()}`);

    response.json({ message: "Exercise deleted successfully" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error deleting customer" });
  }
});


exerciseRouter.post("/many/", authMiddleware, async (request: RequestWithUser, response) => {
  try {
    const docs = await ExerciseRepository.createMany(req.body); // expects array of exercises
    res.status(201).json(docs);
  } catch (err: any) {
    response.status(400).json({ error: err.message });
  }
});

export default exerciseRouter;
