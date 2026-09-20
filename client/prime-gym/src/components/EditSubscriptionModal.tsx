// components/EditSubscriptionModal.tsx
import { forwardRef } from "react";
import type {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";

export type EditSubscriptionFormData = {
  _id: string;
  amount_paid: number;
  subscription_type: string;
  payment_option: string;
};

type EditSubscriptionModalProps = {
  formKey?: string;
  register: UseFormRegister<EditSubscriptionFormData>;
  handleSubmit: UseFormHandleSubmit<EditSubscriptionFormData>;
  errors: FieldErrors<EditSubscriptionFormData>;
  onSubmit: (data: EditSubscriptionFormData) => void;
  onClose: () => void;
};

const EditSubscriptionModal = forwardRef<HTMLDialogElement, EditSubscriptionModalProps>(
  ({ formKey, register, handleSubmit, errors, onSubmit, onClose }, ref) => {
    return (
      <dialog ref={ref} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-white text-black shadow-xl border border-gray-200">
          <h3 className="font-bold text-lg">Edit Details</h3>
          <p className="text-sm text-gray-500 pb-2">Edit transaction details here...</p>
          <div className="modal-action flex-col">
            <form key={formKey} onSubmit={handleSubmit(onSubmit)}>
              <div className="w-full">
                <input type="hidden" {...register("_id")} />
                <div className="flex w-full flex-col gap-2">
                  <label className="label">
                    <span className="label-text text-black">Amount Paid</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Enter your password..."
                    className={`input input-bordered h-12 border bg-white border-gray-700 w-full ${
                      errors.amount_paid ? "input-error" : ""
                    }`}
                    {...register("amount_paid", {
                      required: "Amount Paid is required",
                      valueAsNumber: true,
                      min: {
                        value: 1,
                        message: "Amount Paid must be greater than 0 pesos",
                      },
                    })}
                  />
                  {errors.amount_paid && (
                    <span className="text-red-500 text-sm">
                      {errors.amount_paid.message}
                    </span>
                  )}
                </div>
                <div className="flex w-full my-6 flex-col gap-2">
                  <label className="label">
                    <span className="label-text text-black">
                      Subscription Status
                    </span>
                  </label>

                  <select
                    className="select select-bordered h-12 border bg-white border-gray-700 w-full"
                    {...register("subscription_type", {
                      required: "Subscription status is required",
                    })}
                  >
                    <option value="" disabled>
                      Pick a subscription option
                    </option>
                    <option value="Daily Exercise">Daily Exercise</option>
                    <option value="Monthly Subscription">
                      Monthly Subscription
                    </option>
                    <option value="Coaching Subscription">
                      Coaching Subscription
                    </option>
                    <option value="Monthly with Coaching">
                      {" "}
                      Monthly With Coaching
                    </option>
                  </select>

                  {errors.subscription_type && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.subscription_type.message}
                    </p>
                  )}
                </div>
                <div className="flex w-full my-6 flex-col gap-2">
                  <label className="label">
                    <span className="label-text text-black">
                      Payment Option
                    </span>
                  </label>
                  <select
                    className="select select-bordered h-12 border bg-white border-gray-700 w-full"
                    {...register("payment_option", {
                      required: "Payment option is required",
                    })}
                  >
                    <option value="" disabled>
                      Pick a payment option
                    </option>
                    <option value="Cash">Cash</option>
                    <option value="GCash">GCash</option>
                  </select>

                  {errors.payment_option && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.payment_option.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="gap-2 flex flex-row">
                <button type="submit" className="btn btn-success text-white">
                  Submit
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

EditSubscriptionModal.displayName = "EditSubscriptionModal";

export default EditSubscriptionModal;
