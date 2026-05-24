import React, { useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import useFetchData from "../../data/fetchData";
import updateData from "../../data/updateData";

type FormData = {
  program_name: string;
  description: string;
  date_assigned: string;
};

export default function Edit_Program(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const retrieveProgram = useFetchData({ url: `programs/${id}` });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    if (retrieveProgram && retrieveProgram._id) {
      reset({
        program_name: retrieveProgram.program_name || "",
        description: retrieveProgram.description || "",
        date_assigned: retrieveProgram.date_assigned
          ? retrieveProgram.date_assigned.split("T")[0]
          : "",
      });
    }
  }, [retrieveProgram, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      const response = await updateData({
        url: "programs",
        id: id!,
        updateData: data,
      });

      if (response) {
        alert("Program updated successfully!");
        navigate("/programs");
      }
    } catch (error) {
      console.log(error);
      alert("Failed to update program.");
    }
  };

  return (
    <div className="flex background-white h-screen overflow-hidden">
      <div className="w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-24 overflow-auto">
        <div className="bg-white p-16 rounded-lg">
          <Header
            subheader="Edit and update the program details."
            header="Edit Program"
          />
          <form onSubmit={handleSubmit(onSubmit)} className="w-full my-12">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex w-full my-6 flex-col gap-2">
                <label className="label">
                  <span className="label-text text-black">Program Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter program name..."
                  className={`input input-bordered h-12 border bg-white border-gray-700 w-full ${
                    errors.program_name ? "input-error" : ""
                  }`}
                  {...register("program_name", {
                    required: "Program name is required",
                    minLength: {
                      value: 3,
                      message: "Program name must be at least 3 characters",
                    },
                  })}
                />
                {errors.program_name && (
                  <span className="text-red-500 text-sm">
                    {errors.program_name.message}
                  </span>
                )}
              </div>

              <div className="flex w-full my-6 flex-col gap-2">
                <label className="label">
                  <span className="label-text text-black">Date Assigned</span>
                </label>
                <input
                  type="date"
                  className={`input input-bordered h-12 border bg-white border-gray-700 w-full ${
                    errors.date_assigned ? "input-error" : ""
                  }`}
                  {...register("date_assigned", {
                    required: "Date assigned is required",
                  })}
                />
                {errors.date_assigned && (
                  <span className="text-red-500 text-sm">
                    {errors.date_assigned.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex w-full my-6 flex-col gap-2">
              <label className="label">
                <span className="label-text text-black">Description</span>
              </label>
              <textarea
                placeholder="Enter program description..."
                className={`textarea textarea-bordered h-32 border bg-white border-gray-700 w-full ${
                  errors.description ? "textarea-error" : ""
                }`}
                {...register("description", {
                  required: "Description is required",
                  minLength: {
                    value: 10,
                    message: "Description must be at least 10 characters",
                  },
                })}
              />
              {errors.description && (
                <span className="text-red-500 text-sm">
                  {errors.description.message}
                </span>
              )}
            </div>

            <div className="flex gap-4 mt-8">
              <button type="submit" className="btn btn-primary text-white w-32">
                Update Program
              </button>
              <button
                type="button"
                className="btn btn-outline w-32"
                onClick={() => navigate("/programs")}
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
