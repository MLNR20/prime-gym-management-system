// components/EditExerciseModal.tsx
import { forwardRef } from "react";
import type {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";

export type EditExerciseFormData = {
  _id: string;
  exercise_name: string;
  target_area: string;
  reps: number;
  sets: number;
};

const TARGET_AREAS = [
  "Chest",
  "Legs",
  "Back",
  "Shoulders",
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

type EditExerciseModalProps = {
  formKey?: string;
  register: UseFormRegister<EditExerciseFormData>;
  handleSubmit: UseFormHandleSubmit<EditExerciseFormData>;
  errors: FieldErrors<EditExerciseFormData>;
  onSubmit: (data: EditExerciseFormData) => void;
  onClose: () => void;
};

const EditExerciseModal = forwardRef<HTMLDialogElement, EditExerciseModalProps>(
  ({ formKey, register, handleSubmit, errors, onSubmit, onClose }, ref) => {
    return (
      <dialog ref={ref} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-white text-black shadow-xl border border-gray-200">
          <h3 className="font-bold text-lg">Edit Exercise</h3>
          <p className="text-sm text-gray-500 pb-2">Update the exercise details here...</p>
          <div className="modal-action flex-col">
            <form key={formKey} onSubmit={handleSubmit(onSubmit)}>
              <div className="w-full">
                <input type="hidden" {...register("_id")} />

                <div className="flex w-full flex-col gap-2">
                  <label className="label">
                    <span className="label-text text-black">Exercise Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter exercise name..."
                    className={`input input-bordered h-12 border bg-white border-gray-700 w-full ${
                      errors.exercise_name ? "input-error" : ""
                    }`}
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
                    className={`select select-bordered h-12 border bg-white border-gray-700 w-full ${
                      errors.target_area ? "select-error" : ""
                    }`}
                    {...register("target_area", {
                      required: "Target area is required",
                    })}
                  >
                    <option value="" disabled>
                      Pick a target area...
                    </option>
                    {TARGET_AREAS.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                  {errors.target_area && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.target_area.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex w-full flex-col gap-2">
                    <label className="label">
                      <span className="label-text text-black">Sets</span>
                    </label>
                    <input
                      type="number"
                      className={`input input-bordered h-12 border bg-white border-gray-700 w-full ${
                        errors.sets ? "input-error" : ""
                      }`}
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

                  <div className="flex w-full flex-col gap-2">
                    <label className="label">
                      <span className="label-text text-black">Reps</span>
                    </label>
                    <input
                      type="number"
                      className={`input input-bordered h-12 border bg-white border-gray-700 w-full ${
                        errors.reps ? "input-error" : ""
                      }`}
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
              </div>

              <div className="gap-2 flex flex-row mt-6">
                <button type="submit" className="btn btn-success text-white">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-neutral btn-outline"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* backdrop */}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    );
  }
);

EditExerciseModal.displayName = "EditExerciseModal";

export default EditExerciseModal;
