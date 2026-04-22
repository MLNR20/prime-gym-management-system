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

export default function Add_Locker(): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const usenavigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    console.log("Form Data:", data);

    try {
      alert("Submitted");
      const createContact = await createData({ url: "equipment", data: data });

      if (createContact) {
        usenavigate("/equipment");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex background-white  h-screen overflow-hidden">
      <div className="w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-24   overflow-auto">
        <div className="bg-white p-16 rounded-lg">
          <Header
            subheader="Hey, there! Let's create a contact!"
            header="Add Contact"
          />
          <form onSubmit={handleSubmit(onSubmit)} className="w-full my-12">
            <div className="flex w-full my-6 flex-col gap-2">
              <label className="label">
                <span className="label-text text-black">Equipment</span>
              </label>
              <input
                type="text"
                placeholder="Enter equipment name..."
                className={`input input-bordered h-12 border bg-white border-gray-700 w-full ${
                  errors.equipment_name ? "input-error" : ""
                }`}
                {...register("equipment_name", {
                  required: "Equipment Name is required",
                })}
              />
              {errors.equipment_name && (
                <span className="text-red-500 text-sm">
                  {errors.equipment_name.message}
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
                defaultValue=""
                className="select select-bordered h-12 border bg-white border-gray-700 w-full"
                {...register("equipment_status", {
                  required: "Equipment status is required",
                })}
              >
                <option value="" disabled>
                  Pick a subscription option
                </option>
                <option value="Active">Active</option>
                <option value="Inactive">
                  Inactive
                </option>
                <option value="For Repair">
                  For Repair
                </option>
                <option value="Under Repair">
                  {" "}
                  Under Repair
                </option>
              </select>

              {errors.equipment_status && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.equipment_status.message}
                </p>
              )}
            </div>

            <button className="btn btn-success mt-4">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}
