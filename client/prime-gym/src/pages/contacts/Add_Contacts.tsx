import React from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useForm } from "react-hook-form";
import createData from "../../data/createData";
import { useNavigate } from "react-router-dom";
type FormData = {
  first_name: string;
  last_name: string;
  role: string;
  contact_number: string;
};

export default function Add_Contacts(): React.ReactElement {
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
      const createContact = await createData({url: "contacts", data: data})
      
      if(createContact)
      {
        usenavigate("/contacts")
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
            <div className="flex w-full my-6  flex-col gap-2">
              <label className="label">
                <span className="label-text text-black">First Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter your password..."
                className={`input input-bordered h-12 border bg-white border-gray-700 w-full ${
                  errors.first_name ? "input-error" : ""
                }`}
                {...register("first_name", {
                  required: "First name is required",
                  minLength: {
                    value: 3,
                    message: "First name must be at least 3 characters",
                  },
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Only letters and spaces are allowed",
                  },
                })}
              />
              {errors.first_name && (
                <span className="text-red-500 text-sm">
                  {errors.first_name.message}
                </span>
              )}
            </div>
            <div className="flex w-full my-6 flex-col gap-2">
              <label className="label">
                <span className="label-text text-black">Last Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter your password..."
                className={`input input-bordered h-12 border bg-white border-gray-700 w-full ${
                  errors.last_name ? "input-error" : ""
                }`}
                {...register("last_name", {
                  required: "Last name is required",
                  minLength: {
                    value: 5,
                    message: "Last name must be at least 5 characters",
                  },
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Only letters and spaces are allowed",
                  },
                })}
              />
              {errors.last_name && (
                <span className="text-red-500 text-sm">
                  {errors.last_name.message}
                </span>
              )}
            </div>
            <div className="flex w-full my-6 flex-col gap-2">
              <label className="label">
                <span className="label-text text-black">Role</span>
              </label>
              <input
                type="text"
                placeholder="Enter your password..."
                className={`input input-bordered h-12 border bg-white border-gray-700 w-full ${
                  errors.role ? "input-error" : ""
                }`}
                {...register("role", {
                  required: "Role is required",
                  minLength: {
                    value: 3,
                    message: "Last name must be at least 3 characters",
                  },
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Only letters and spaces are allowed",
                  },
                })}
              />
              {errors.role && (
                <span className="text-red-500 text-sm">
                  {errors.role.message}
                </span>
              )}
            </div>
            <div className="flex w-full my-6 flex-col gap-2">
              <label className="label">
                <span className="label-text text-black">Contact No</span>
              </label>
              <input
                type="number"
                placeholder="Enter your password..."
                className={`input input-bordered h-12 border bg-white border-gray-700 w-full ${
                  errors.contact_number ? "input-error" : ""
                }`}
                {...register("contact_number", {
                  required: "Contact Number is required",
                  minLength: {
                    value: 9,
                    message: "Contact number must be at least 9 characters",
                  },
                  pattern: {
                    value: /^[0-9\s]+$/,
                    message: "Only numbers are allowed",
                  },
                })}
              />
              {errors.contact_number && (
                <span className="text-red-500 text-sm">
                  {errors.contact_number.message}
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
