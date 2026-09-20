import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../../components/Sidebar";
import EditLoadingScreen from "../../components/EditLoadingScreen";
import Header from "../../components/Header";
import ConfirmModal from "../../components/ConfirmModal";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import updateData from "../../data/updateData";
import fetchRecord from "../../data/fetchRecord";

type Params = {
  id: string;
};

type FormData = {
  equipment_name: string;
  equipment_status: string;
};

export default function Edit_Equipment(): React.ReactElement {
  const { id } = useParams<Params>();
  const redirect = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const [loading, setLoading] = useState(true);
  const [pendingData, setPendingData] = useState<FormData | null>(null);
  const modalRef = useRef<HTMLDialogElement>(null);

  const onValidSubmit = (data: FormData) => {
    setPendingData(data);
    modalRef.current?.showModal();
  };

  const confirmSubmit = async () => {
    if (!pendingData) return;
    try {
      await updateData({ url: "equipment", id: id!.toString(), updateData: pendingData });
      modalRef.current?.close();
      redirect("/equipment", {
        state: { alertMessage: "Equipment updated successfully!", alertVariant: "success" },
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch existing equipment record
  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        setLoading(true);
        const result = await fetchRecord({ url: "equipment", id });
        if (result) {
          reset(result);
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
    return <EditLoadingScreen message="Loading equipment record..." />;
  }

  return (
    <div className="flex background-white h-screen p-6 min-[1025px]:p-0 landscape:min-[1024px]:p-0 min-[1025px]:flex-row landscape:min-[1024px]:flex-row flex-col overflow-hidden">
      <div className="w-full min-[1025px]:w-64 landscape:min-[1024px]:w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 min-[1025px]:p-24 landscape:min-[1024px]:p-24 overflow-auto">
        <div className="bg-white p-6 sm:p-16 rounded-lg">
          <Header
            subheader="Update the details of this gym equipment."
            header="Edit Equipment"
          />

          <form onSubmit={handleSubmit(onValidSubmit)} className="w-full my-12">
            {/* Equipment Name */}
            <div className="flex w-full my-6 flex-col gap-2">
              <label className="label">
                <span className="label-text text-black">Equipment Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter equipment name..."
                className={`input input-bordered h-12 border bg-white border-gray-700 w-full ${
                  errors.equipment_name ? "input-error" : ""
                }`}
                {...register("equipment_name", {
                  required: "Equipment name is required",
                })}
              />
              {errors.equipment_name && (
                <span className="text-red-500 text-sm">
                  {errors.equipment_name.message}
                </span>
              )}
            </div>

            {/* Equipment Status */}
            <div className="flex w-full my-6 flex-col gap-2">
              <label className="label">
                <span className="label-text text-black">Equipment Status</span>
              </label>
              <select
                className={`select select-bordered h-12 border bg-white border-gray-700 w-full ${
                  errors.equipment_status ? "select-error" : ""
                }`}
                {...register("equipment_status", {
                  required: "Equipment status is required",
                })}
              >
                <option value="" disabled>
                  Select equipment status...
                </option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="For Repair">For Repair</option>
                <option value="Under Repair">Under Repair</option>
              </select>
              {errors.equipment_status && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.equipment_status.message}
                </p>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button type="submit" className="btn btn-success text-white">
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-neutral btn-outline"
                onClick={() => redirect("/equipment")}
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
                Are you sure you want to save these changes to{" "}
                <span className="font-semibold">{pendingData?.equipment_name}</span>?
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