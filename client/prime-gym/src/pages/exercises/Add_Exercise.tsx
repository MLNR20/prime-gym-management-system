import React from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useForm, useFieldArray } from "react-hook-form";
import createData from "../../data/createData";
import { useNavigate } from "react-router-dom";

type ExerciseEntry = {
  exercise_name: string;
  target_area: string;
  reps: number;
  sets: number;
};

type FormData = {
  multiple: boolean;
  exercise_name: string;
  target_area: string;
  reps: number;
  sets: number;
  exercises: ExerciseEntry[];
};

export default function Add_Exercise(): React.ReactElement {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      multiple: false,
      exercise_name: "",
      target_area: "",
      reps: 1,
      sets: 1,
      exercises: [
        {
          exercise_name: "",
          target_area: "",
          reps: 1,
          sets: 1,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "exercises",
  });

  const isMultiple = watch("multiple");
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      if (data.multiple) {
        const payload = data.exercises.filter((exercise) =>
          exercise.exercise_name.trim() || exercise.target_area.trim() || exercise.sets > 0 || exercise.reps > 0,
        );

        console.log(payload)

        if (payload.length === 0) {
          alert("Please fill in at least one exercise.");
          return;
        }

        const response = await createData({ url: "exercises/many/", data: payload });
        if (response) {
          navigate("/exercises");
        }
      } else {
        const response = await createData({
          url: "exercises",
          data: {
            exercise_name: data.exercise_name,
            target_area: data.target_area,
            reps: data.reps,
            sets: data.sets,
          },
        });

        if (response) {
          navigate("/exercises");
        }
      }
    } catch (error) {
      console.error(error);
      alert("Failed to create exercise.");
    }
  };

  return (
    <div className="flex background-white h-screen overflow-hidden">
      <div className="w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-24 overflow-auto">
        <div className="bg-white p-16 rounded-lg">
          <Header
            subheader="Create a new exercise with reps, sets, and target area."
            header="Add Exercise"
          />

          <form onSubmit={handleSubmit(onSubmit)} className="w-full my-12">
            {!isMultiple ? (
              <>
                <div className="grid grid-cols-3 gap-6">
                  <div className="flex w-full my-6 flex-col gap-2">
                    <label className="label">
                      <span className="label-text text-black">Exercise Name</span>
                    </label>
                    <input
                      type="text"
                      className={`input input-bordered h-12 border bg-white border-gray-700 w-full ${errors.exercise_name ? "input-error" : ""}`}
                      {...register("exercise_name", {
                        required: "Exercise name is required",
                        minLength: { value: 3, message: "Minimum 3 characters" },
                      })}
                    />
                    {errors.exercise_name && (
                      <span className="text-red-500 text-sm">
                        {errors.exercise_name.message}
                      </span>
                    )}
                  </div>

                  <div className="flex w-full my-6 flex-col gap-2">
                    <label className="label">
                      <span className="label-text text-black">Target Area</span>
                    </label>
                    <select
                      className={`select select-bordered h-12 border bg-white border-gray-700 w-full ${errors.target_area ? "select-error" : ""}`}
                      defaultValue=""
                      {...register("target_area", {
                        required: "Target area is required",
                      })}
                    >
                      <option value="" disabled>
                        Pick a target area...
                      </option>
                      <option value="Chest">Chest</option>
                      <option value="Legs">Legs</option>
                      <option value="Back">Back</option>
                      <option value="Shoulders">Shoulders</option>
                      <option value="Arms">Arms</option>
                      <option value="Abs">Abs</option>
                      <option value="Biceps">Biceps</option>
                      <option value="Triceps">Triceps</option>
                      <option value="Forearms">Forearms</option>
                      <option value="Calves">Calves</option>
                      <option value="Glutes">Glutes</option>
                      <option value="Obliques">Obliques</option>
                      <option value="Traps">Traps</option>
                      <option value="Lats">Lats</option>
                      <option value="FullBody">FullBody</option>
                    </select>
                    {errors.target_area && (
                      <span className="text-red-500 text-sm">
                        {errors.target_area.message}
                      </span>
                    )}
                  </div>

                  <div className="flex w-full my-6 flex-col gap-2">
                    <label className="label">
                      <span className="label-text text-black">Sets</span>
                    </label>
                    <input
                      type="number"
                      className={`input input-bordered h-12 border bg-white border-gray-700 w-full ${errors.sets ? "input-error" : ""}`}
                      {...register("sets", {
                        required: "Sets are required",
                        valueAsNumber: true,
                        min: { value: 1, message: "Minimum 1 set" },
                      })}
                    />
                    {errors.sets && (
                      <span className="text-red-500 text-sm">
                        {errors.sets.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="flex w-full my-6 flex-col gap-2">
                    <label className="label">
                      <span className="label-text text-black">Reps</span>
                    </label>
                    <input
                      type="number"
                      className={`input input-bordered h-12 border bg-white border-gray-700 w-full ${errors.reps ? "input-error" : ""}`}
                      {...register("reps", {
                        required: "Reps are required",
                        valueAsNumber: true,
                        min: { value: 1, message: "Minimum 1 rep" },
                      })}
                    />
                    {errors.reps && (
                      <span className="text-red-500 text-sm">
                        {errors.reps.message}
                      </span>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  {fields.map((field, index) => {
                    const rowErrors = errors.exercises?.[index];
                    return (
                      <div
                        key={field.id}
                        className="grid grid-cols-[2fr_1fr_1fr_auto] gap-4 items-end rounded-lg border border-slate-200 p-4"
                      >
                        <div className="flex flex-col gap-2">
                          <label className="label">
                            <span className="label-text text-black">Exercise</span>
                          </label>
                          <input
                            type="text"
                            className={`input input-bordered h-12 border bg-white border-gray-700 w-full ${rowErrors?.exercise_name ? "input-error" : ""}`}
                            {...register(`exercises.${index}.exercise_name` as const, {
                              required: "Exercise name is required",
                              minLength: { value: 3, message: "Minimum 3 characters" },
                            })}
                          />
                          {rowErrors?.exercise_name && (
                            <span className="text-red-500 text-sm">
                              {rowErrors.exercise_name?.message}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="label">
                            <span className="label-text text-black">Target Area</span>
                          </label>
                          <select
                            className={`select select-bordered h-12 border bg-white border-gray-700 w-full ${rowErrors?.target_area ? "select-error" : ""}`}
                            defaultValue=""
                            {...register(`exercises.${index}.target_area` as const, {
                              required: "Target area is required",
                            })}
                          >
                            <option value="" disabled>
                              Pick an area...
                            </option>
                            <option value="Chest">Chest</option>
                            <option value="Legs">Legs</option>
                            <option value="Back">Back</option>
                            <option value="Abs">Abs</option>
                            <option value="Biceps">Biceps</option>
                            <option value="Triceps">Triceps</option>
                            <option value="Forearms">Forearms</option>
                            <option value="Calves">Calves</option>
                            <option value="Glutes">Glutes</option>
                            <option value="Obliques">Obliques</option>
                            <option value="Traps">Traps</option>
                            <option value="Lats">Lats</option>
                            <option value="FullBody">FullBody</option>
                          </select>
                          {rowErrors?.target_area && (
                            <span className="text-red-500 text-sm">
                              {rowErrors.target_area?.message}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="label">
                            <span className="label-text text-black">Sets</span>
                          </label>
                          <input
                            type="number"
                            className={`input input-bordered h-12 border bg-white border-gray-700 w-full ${rowErrors?.sets ? "input-error" : ""}`}
                            {...register(`exercises.${index}.sets` as const, {
                              required: "Sets are required",
                              valueAsNumber: true,
                              min: { value: 1, message: "Minimum 1 set" },
                            })}
                          />
                          {rowErrors?.sets && (
                            <span className="text-red-500 text-sm">
                              {rowErrors.sets?.message}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="btn btn-outline btn-error h-12"
                        >
                          Delete
                        </button>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  className="btn bg-slate-200 text-slate-900 border-slate-300 mt-4"
                  onClick={() =>
                    append({ exercise_name: "", target_area: "", reps: 1, sets: 1 })
                  }
                >
                  Add exercise
                </button>
              </>
            )}

            <label className="flex items-center gap-2 mt-8">
              <input type="checkbox" className="checkbox checkbox-primary" {...register("multiple")} />
              <span className="text-sm text-slate-700">Add multiple exercises</span>
            </label>

            <button type="submit" className="btn btn-success mt-6 text-white">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
