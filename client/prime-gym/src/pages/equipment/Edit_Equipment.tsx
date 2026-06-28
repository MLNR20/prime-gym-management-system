import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
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

  const onSubmit = async (data: FormData) => {
    try {
      await updateData({ url: "equipment", id: id!.toString(), updateData: data });
      redirect("/equipment");
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
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="flex background-white h-screen overflow-hidden">
      <div className="w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-24 overflow-auto">
        <div className="bg-white p-16 rounded-lg">
          <Header
            subheader="Update the details of this gym equipment."
            header="Edit Equipment"
          />

          <form onSubmit={handleSubmit(onSubmit)} className="w-full my-12">
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
        </div>
      </div>
    </div>
  );
}