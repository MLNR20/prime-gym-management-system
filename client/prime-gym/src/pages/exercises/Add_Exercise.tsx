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

const TARGET_AREAS = [
  "Chest",
  "Legs",
  "Back",
  "Shoulders",
  "Arms",
  "Abs",
  "Biceps",
  "Triceps",
  "Forearms",
  "Calves",
  "Glutes",
  "Obliques",
  "Traps",
  "Lats",
  "FullBody",
];

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

  const labelClass = "text-sm mb-2 font-medium text-gray-700";
  const inputClass = (hasError: boolean) =>
    `input input-bordered h-12 border bg-white border-gray-400 text-gray-500 placeholder-gray-400 w-full ${hasError ? "input-error" : ""}`;
  const selectClass = (hasError: boolean) =>
    `select select-bordered h-12 border bg-white border-gray-400 text-gray-500 w-full ${hasError ? "select-error" : ""}`;

  const onSubmit = async (data: FormData) => {
    try {
      if (data.multiple) {
        const payload = data.exercises.filter((exercise) =>
          exercise.exercise_name.trim() || exercise.target_area.trim() || exercise.sets > 0 || exercise.reps > 0,
        );

        if (payload.length === 0) {
          return;
        }

        const response = await createData({ url: "exercises/many/", data: payload });
        if (response) {
          navigate("/exercises", {
            state: { alertMessage: "Exercises added successfully!", alertVariant: "success" },
          });
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
          navigate("/exercises", {
            state: { alertMessage: "Exercise added successfully!", alertVariant: "success" },
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-screen p-6 min-[1025px]:p-0 landscape:min-[1024px]:p-0 min-[1025px]:flex-row landscape:min-[1024px]:flex-row flex-col overflow-hidden">
      <div className="w-full min-[1025px]:w-64 landscape:min-[1024px]:w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 min-[1025px]:p-24 landscape:min-[1024px]:p-24 overflow-auto">
        <div className="bg-white p-6 sm:p-16 rounded-lg">
          <Header
            subheader="Create a new exercise with reps, sets, and target area."
            header="Add Exercise"
          />

          <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-10">

            {/* ── MODE TOGGLE ── */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                Exercise Details
              </span>
              <hr className="flex-1 border-gray-300" />
            </div>

            <label className="flex items-center gap-2 mb-8 cursor-pointer w-fit">
              <input type="checkbox" className="checkbox checkbox-success" {...register("multiple")} />
              <span className="text-sm font-medium text-gray-700">Add multiple exercises</span>
            </label>

            {!isMultiple ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {/* Exercise Name */}
                <div className="flex flex-col gap-1">
                  <label className={labelClass}>Exercise Name</label>
                  <input
                    type="text"
                    placeholder="Enter exercise name..."
                    className={inputClass(!!errors.exercise_name)}
                    {...register("exercise_name", {
                      required: "Exercise name is required",
                      minLength: { value: 3, message: "Minimum 3 characters" },
                    })}
                  />
                  {errors.exercise_name && (
                    <span className="text-red-500 text-sm">{errors.exercise_name.message}</span>
                  )}
                </div>

                {/* Target Area */}
                <div className="flex flex-col gap-1">
                  <label className={labelClass}>Target Area</label>
                  <select
                    defaultValue=""
                    className={selectClass(!!errors.target_area)}
                    {...register("target_area", { required: "Target area is required" })}
                  >
                    <option value="" disabled>Pick a target area...</option>
                    {TARGET_AREAS.map((area) => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                  {errors.target_area && (
                    <span className="text-red-500 text-sm">{errors.target_area.message}</span>
                  )}
                </div>

                {/* Sets */}
                <div className="flex flex-col gap-1">
                  <label className={labelClass}>Sets</label>
                  <input
                    type="number"
                    placeholder="Enter number of sets..."
                    className={inputClass(!!errors.sets)}
                    {...register("sets", {
                      required: "Sets are required",
                      valueAsNumber: true,
                      min: { value: 1, message: "Minimum 1 set" },
                    })}
                  />
                  {errors.sets && (
                    <span className="text-red-500 text-sm">{errors.sets.message}</span>
                  )}
                </div>

                {/* Reps */}
                <div className="flex flex-col gap-1">
                  <label className={labelClass}>Reps</label>
                  <input
                    type="number"
                    placeholder="Enter number of reps..."
                    className={inputClass(!!errors.reps)}
                    {...register("reps", {
                      required: "Reps are required",
                      valueAsNumber: true,
                      min: { value: 1, message: "Minimum 1 rep" },
                    })}
                  />
                  {errors.reps && (
                    <span className="text-red-500 text-sm">{errors.reps.message}</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="mb-8">
                <div className="space-y-4">
                  {fields.map((field, index) => {
                    const rowErrors = errors.exercises?.[index];
                    return (
                      <div
                        key={field.id}
                        className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_auto] gap-4 items-end rounded-lg border border-gray-300 bg-white p-4"
                      >
                        <div className="flex flex-col gap-1">
                          <label className={labelClass}>Exercise</label>
                          <input
                            type="text"
                            placeholder="Enter exercise name..."
                            className={inputClass(!!rowErrors?.exercise_name)}
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

                        <div className="flex flex-col gap-1">
                          <label className={labelClass}>Target Area</label>
                          <select
                            defaultValue=""
                            className={selectClass(!!rowErrors?.target_area)}
                            {...register(`exercises.${index}.target_area` as const, {
                              required: "Target area is required",
                            })}
                          >
                            <option value="" disabled>Pick an area...</option>
                            {TARGET_AREAS.map((area) => (
                              <option key={area} value={area}>{area}</option>
                            ))}
                          </select>
                          {rowErrors?.target_area && (
                            <span className="text-red-500 text-sm">
                              {rowErrors.target_area?.message}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className={labelClass}>Sets</label>
                          <input
                            type="number"
                            placeholder="Sets..."
                            className={inputClass(!!rowErrors?.sets)}
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
                  className="btn btn-neutral btn-outline mt-4"
                  onClick={() =>
                    append({ exercise_name: "", target_area: "", reps: 1, sets: 1 })
                  }
                >
                  Add Exercise
                </button>
              </div>
            )}

            <hr className="border-t border-gray-200 mt-6 mb-6" />

            <div className="flex gap-3">
              <button type="submit" className="btn btn-success text-white">
                Submit
              </button>
              <button
                type="button"
                className="btn btn-neutral btn-outline"
                onClick={() => navigate("/exercises")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}