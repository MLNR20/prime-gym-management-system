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
  locker_number: string;
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
        await updateData({url: "lockers", id:id!.toString() ,updateData: data})

        redirect("/lockers")
        
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
          url: "lockers",
          id,
        });

        if (result) {
          reset(result);
        }

        console.log(result.lockerNumber)
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
            header="Edit Locker"
          />

          <form onSubmit={handleSubmit(onSubmit)} className="w-full my-12">

             <div className="flex w-full my-6 flex-col gap-2">
              <label className="label">
                <span className="label-text text-black">Locker Number</span>
              </label>
              <input
                type="number"
                placeholder="Enter locker number..."
                className={`input input-bordered h-12 border bg-white border-gray-700 w-full ${
                  errors.locker_number ? "input-error" : ""
                }`}
                {...register("locker_number", {
                  required: "Locker Number is required",
                  minLength: {
                    value: 1,
                    message: "Locker number must not be 0",
                  },
                  pattern: {
                    value: /^[0-9\s]+$/,
                    message: "Only numbers are allowed",
                  },
                })}
              />
              {errors.locker_number && (
                <span className="text-red-500 text-sm">
                  {errors.locker_number.message}
                </span>
              )}
            </div>
            <button className="btn btn-success mt-4">Update</button>
          </form>
        </div>
      </div>
    </div>
  );
}