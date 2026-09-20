import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../../components/Sidebar";
import EditLoadingScreen from "../../components/EditLoadingScreen";
import Header from "../../components/Header";
import ConfirmModal from "../../components/ConfirmModal";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import fetchRecord from "../../data/fetchRecord";
import patchUpdateData from "../../data/patchUpdateData";

type Params = {
  id: string;
};

type FormData = {
  amount_paid: number;
  subscription_type: string;
  payment_option: string;
};

export default function Approve_Subscription(): React.ReactElement {
  const { id } = useParams<Params>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<any>(null);
  const [pendingData, setPendingData] = useState<FormData | null>(null);
  const modalRef = useRef<HTMLDialogElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onValidSubmit = (data: FormData) => {
    setPendingData(data);
    modalRef.current?.showModal();
  };

  const confirmSubmit = async () => {
    if (!pendingData || !id) return;
    try {
      await patchUpdateData({
        url: "customers/update-subscription",
        id,
        updateData: pendingData,
      });
      modalRef.current?.close();
      navigate("/customers", {
        state: { alertMessage: "Customer subscription updated successfully!", alertVariant: "success" },
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        setLoading(true);
        const result = await fetchRecord({ url: "customers", id });
        if (result) {
          setCustomer(result);
          reset({
            amount_paid: Number(result.amount_paid) || 0,
            subscription_type: result.subscription_type || "",
            payment_option: result.payment_option || "",
          });
        }
      } catch (error) {
        console.log("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, reset]);

  if (loading) {
    return <EditLoadingScreen message="Loading customer subscription..." />;
  }

  const labelClass = "text-sm font-medium text-gray-500";
  const inputClass = (hasError: boolean) =>
    `input input-bordered h-12 border bg-white border-gray-400 text-gray-500 placeholder-gray-400 w-full ${hasError ? "input-error" : ""}`;
  const selectClass = "select select-bordered h-12 border bg-white border-gray-400 text-gray-500 w-full";

  return (
    <div className="background-white flex h-screen p-6 min-[1025px]:p-0 landscape:min-[1024px]:p-0 min-[1025px]:flex-row landscape:min-[1024px]:flex-row flex-col overflow-hidden">
      <div className="w-full min-[1025px]:w-64 landscape:min-[1024px]:w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 min-[1025px]:p-24 landscape:min-[1024px]:p-24 overflow-auto">
        <div className="bg-white p-6 sm:p-16 rounded-lg">
          <Header
            header="Approve Subscription"
            subheader={
              customer
                ? `Update transaction details for ${customer.first_name} ${customer.last_name}.`
                : "Update the subscription transaction details."
            }
          />

          <form onSubmit={handleSubmit(onValidSubmit)} className="w-full mt-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-2">
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Amount Paid</label>
                <input
                  type="number"
                  placeholder="Enter amount paid..."
                  className={inputClass(!!errors.amount_paid)}
                  {...register("amount_paid", {
                    required: "Amount Paid is required",
                    valueAsNumber: true,
                    min: { value: 1, message: "Amount Paid must be greater than 0 pesos" },
                  })}
                />
                {errors.amount_paid && (
                  <span className="text-red-500 text-sm">{errors.amount_paid.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Subscription Status</label>
                <select
                  className={selectClass}
                  {...register("subscription_type", { required: "Subscription status is required" })}
                >
                  <option value="" disabled>Pick a subscription option</option>
                  <option value="Daily Exercise">Daily Exercise</option>
                  <option value="Monthly Subscription">Monthly Subscription</option>
                  <option value="Coaching Subscription">Coaching Subscription</option>
                  <option value="Monthly with Coaching">Monthly With Coaching</option>
                </select>
                {errors.subscription_type && (
                  <span className="text-red-500 text-sm">{errors.subscription_type.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Payment Option</label>
                <select
                  className={selectClass}
                  {...register("payment_option", { required: "Payment option is required" })}
                >
                  <option value="" disabled>Pick a payment option</option>
                  <option value="Cash">Cash</option>
                  <option value="GCash">GCash</option>
                </select>
                {errors.payment_option && (
                  <span className="text-red-500 text-sm">{errors.payment_option.message}</span>
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
                onClick={() => navigate("/customers")}
              >
                Cancel
              </button>
            </div>
          </form>

          <ConfirmModal
            ref={modalRef}
            title="Confirm Update"
            message={
              <>
                Are you sure you want to save these subscription changes
                {customer ? (
                  <>
                    {" "}
                    for <span className="font-semibold">{customer.first_name} {customer.last_name}</span>
                  </>
                ) : null}
                ?
              </>
            }
            confirmLabel="Yes, Update"
            onConfirm={confirmSubmit}
          />
        </div>
      </div>
    </div>
  );
}
