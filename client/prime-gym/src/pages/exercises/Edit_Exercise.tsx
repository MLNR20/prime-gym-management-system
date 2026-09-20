import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import EditLoadingScreen from "../../components/EditLoadingScreen";
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

      navigate("/exercises", {
        state: { alertMessage: "Exercise updated successfully!", alertVariant: "success" },
      });
    } catch (error) {
      console.error(error);
      alert("Failed to update exercise.");
    }
  };

  if (loading) {
    return <EditLoadingScreen message="Loading exercise record..." />;
  }

  const labelClass = "text-sm mb-2 font-medium text-gray-700";
  const inputClass = (hasError: boolean) =>
    `input input-bordered h-12 border bg-white border-gray-400 text-gray-500 placeholder-gray-400 w-full ${hasError ? "input-error" : ""}`;
  const selectClass = (hasError: boolean) =>
    `select select-bordered h-12 border bg-white border-gray-400 text-gray-500 w-full ${hasError ? "select-error" : ""}`;

  return (
    <div className="background-white flex h-screen p-6 min-[1025px]:p-0 landscape:min-[1024px]:p-0 min-[1025px]:flex-row landscape:min-[1024px]:flex-row flex-col overflow-hidden">
      <div className="w-full min-[1025px]:w-64 landscape:min-[1024px]:w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 min-[1025px]:p-24 landscape:min-[1024px]:p-24 overflow-auto">
        <div className="bg-white p-6 sm:p-16 rounded-lg">
          <Header
            subheader="Edit the exercise details for reps, sets, and target area."
            header="Edit Exercise"
          />

          <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-10">

            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                Exercise Details
              </span>
              <hr className="flex-1 border-gray-300" />
            </div>

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

            <hr className="border-t border-gray-200 mt-6 mb-6" />

            <div className="flex gap-3">
              <button type="submit" className="btn btn-success text-white">
                Save Changes
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
