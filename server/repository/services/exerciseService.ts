// src/services/authService.ts
import { ExerciseRepository } from "../exerciseRepository";
import { IExercise } from "../../models/exercise";
import LogsRepository from "../../repository/logsRepository";

export class ExerciseServices {
  private exerciseRepository: ExerciseRepository;

  constructor(exerciseRepository: ExerciseRepository) {
    this.exerciseRepository = exerciseRepository;
  }


}


