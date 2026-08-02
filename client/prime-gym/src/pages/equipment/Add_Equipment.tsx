import React from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useForm } from "react-hook-form";
import createData from "../../data/createData";
import { useNavigate } from "react-router-dom";

type FormData = {
  equipment_name: string;
  equipment_status: string;
};

export default function Add_Equipment(): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const usenavigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      const createEquipment = await createData({ url: "equipment", data: data });

      if (createEquipment) {
        usenavigate("/equipment");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex background-white h-screen p-6 md:p-0 lg:p-0 lg:flex-row md:flex-row flex-col overflow-hidden">
      <div className="w-full md:w-48 lg:w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 md:p-24 lg:p-24 overflow-auto">
        <div className="bg-white p-16 rounded-lg">
          <Header
            subheader="Fill in the details below to register new gym equipment."
            header="Add Equipment"
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
                defaultValue=""
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
                Add Equipment
              </button>
              <button
                type="button"
                className="btn btn-neutral btn-outline"
                onClick={() => usenavigate("/equipment")}
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
