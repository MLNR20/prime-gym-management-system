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

export default function Edit_Lockers(): React.ReactElement {
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
      console.log("Form Data:", data);
  
      try {
        alert("Submitted");
        await updateData({url: "equipment", id:id!.toString() ,updateData: data})

        redirect("/equipment")
        
      } catch (error) {
        console.log(error);
      }
    };

  // ✅ FETCH DATA
  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        setLoading(true);

        const result = await fetchRecord({
          url: "equipment",
          id,
        });

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

  
  // ✅ LOADING STATE
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
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
            subheader="Hey, there! Let's change your Locker!"
            header="Edit Equipment"
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
            <button className="btn btn-success mt-4">Update</button>
          </form>
        </div>
      </div>
    </div>
    
  );
}