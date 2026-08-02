import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useForm } from "react-hook-form";
import updateData from "../../data/updateData";
import fetchRecord from "../../data/fetchRecord";
import { useNavigate, useParams } from "react-router-dom";

type FormData = {
  exercise_name: string;
  target_area: string;
  reps: number;
  sets: number;
};

type Params = {
  id: string;
};

export default function Edit_Exercise(): React.ReactElement {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      exercise_name: "",
      target_area: "",
      reps: 1,
      sets: 1,
    },
  });
  const navigate = useNavigate();
  const { id } = useParams<Params>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        setLoading(true);
        const exercise = await fetchRecord({ url: "exercises", id });
        if (exercise) {
          reset({
            exercise_name: exercise.exercise_name || "",
            target_area: exercise.target_area || "",
            reps: exercise.reps || 1,
            sets: exercise.sets || 1,
          });
        }
      } catch (error) {
        console.error(error);
        alert("Failed to load exercise record.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      await updateData({
        url: "exercises",
        id: id!,
        updateData: data,
      });

      navigate("/exercises");
    } catch (error) {
      console.error(error);
      alert("Failed to update exercise.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">Loading...</div>
    );
  }

  return (
    <div className="flex background-white h-screen p-6 md:p-0 lg:p-0 lg:flex-row md:flex-row flex-col overflow-hidden">
      <div className="w-full md:w-48 lg:w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 md:p-24 lg:p-24 overflow-auto">
        <div className="bg-white p-16 rounded-lg">
          <Header
            subheader="Edit the exercise details for reps, sets, and target area."
            header="Edit Exercise"
          />

          <form onSubmit={handleSubmit(onSubmit)} className="w-full my-12">
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

            <div className="flex gap-4 mt-8">
              <button type="submit" className="btn btn-success text-white px-6">
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-outline px-6"
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
