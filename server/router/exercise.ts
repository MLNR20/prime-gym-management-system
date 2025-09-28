import express from "express";
import ExerciseRepository from "../repository/exerciseRepository";
import LogsRepository from "../repository/logsRepository";
import { CustomerService } from "../repository/services/customerService";

const exerciseRouter = express.Router();
//const customerService = new CustomerService(CustomerRepository);

// CREATE
exerciseRouter.post("/", async (request, response) => {
  try {
    const newExercise = {
      exercise_name: request.body.exercise_name,
      target_area: request.body.target_area,
      reps: request.body.reps,
      sets: request.body.sets,
    };

    const createNewExercise = await ExerciseRepository.create(newExercise);
    return response.status(200).send(createNewExercise);
  } catch (error) {
    console.log(error);
  }
});

// READ ALL
exerciseRouter.get("/", async (request, response) => {
  try {
    const exercises = await ExerciseRepository.findAll();
    response.json(exercises);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error fetching exercises" });
  }
});

// UPDATE
exerciseRouter.put("/:id", async (request, response) => {
  try {
    const updatedCustomer = await ExerciseRepository.update(
      request.params.id,
      request.body
    );
    if (!updatedCustomer) {
      return response.status(404).json({ message: "Exercise not found" });
    }
    response.json(updatedCustomer);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error updating customer" });
  }
});


//DELETE
exerciseRouter.delete("/:id", async (request, response) => {
  try {
    const deletedCustomer = await ExerciseRepository.delete(request.params.id);
    if (!deletedCustomer) {
      return response.status(404).json({ message: "Customer not found" });
    }
    response.json({ message: "Exercise deleted successfully" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error deleting customer" });
  }
});




exerciseRouter.post("/many/", async (req, res) => {
  try {
    const docs = await ExerciseRepository.createMany(req.body); // expects array of exercises
    res.status(201).json(docs);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default exerciseRouter;
