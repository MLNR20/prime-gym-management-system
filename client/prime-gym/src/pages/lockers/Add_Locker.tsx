import React from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useForm } from "react-hook-form";
import createData from "../../data/createData";
import { useNavigate } from "react-router-dom";
type FormData = {
  lockerNumber: string;
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
      const createContact = await createData({url: "lockers", data: data})
      
      if(createContact)
      {
        usenavigate("/lockers")
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
            subheader="Hey, there! Let's create a locker!"
            header="Add Locker"
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
                  errors.lockerNumber ? "input-error" : ""
                }`}
                {...register("lockerNumber", {
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
              {errors.lockerNumber && (
                <span className="text-red-500 text-sm">
                  {errors.lockerNumber.message}
                </span>
              )}
            </div>

            <button className="btn btn-success mt-4">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}
