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
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      const createContact = await createData({ url: "contacts", data: data });
      if (createContact) {
        navigate("/contacts", {
          state: { alertMessage: "Contact added successfully!", alertVariant: "success" },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const labelClass = "text-sm mb-2 font-medium text-gray-700";
  const inputClass = (hasError: boolean) =>
    `input input-bordered h-12 border bg-white border-gray-400 text-gray-500 placeholder-gray-400 w-full ${hasError ? "input-error" : ""}`;

  return (
    <div className="flex background-white h-screen p-6 min-[1025px]:p-0 landscape:min-[1024px]:p-0 min-[1025px]:flex-row landscape:min-[1024px]:flex-row flex-col overflow-hidden">
      <div className="w-full min-[1025px]:w-64 landscape:min-[1024px]:w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 min-[1025px]:p-24 landscape:min-[1024px]:p-24 overflow-auto">
        <div className="bg-white p-6 sm:p-16 rounded-lg">
          <Header
            subheader="Hey, there! Let's create a contact!"
            header="Add Contact"
          />
          <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-10">

            {/* ── CONTACT INFO ── */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                Contact Info
              </span>
              <hr className="flex-1 border-gray-300" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {/* First Name */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>First Name</label>
                <input
                  type="text"
                  placeholder="Enter first name..."
                  className={inputClass(!!errors.first_name)}
                  {...register("first_name", {
                    required: "First name is required",
                    minLength: { value: 3, message: "First name must be at least 3 characters" },
                    pattern: { value: /^[A-Za-z\s]+$/, message: "Only letters and spaces are allowed" },
                  })}
                />
                {errors.first_name && (
                  <span className="text-red-500 text-sm">{errors.first_name.message}</span>
                )}
              </div>

              {/* Last Name */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Last Name</label>
                <input
                  type="text"
                  placeholder="Enter last name..."
                  className={inputClass(!!errors.last_name)}
                  {...register("last_name", {
                    required: "Last name is required",
                    minLength: { value: 5, message: "Last name must be at least 5 characters" },
                    pattern: { value: /^[A-Za-z\s]+$/, message: "Only letters and spaces are allowed" },
                  })}
                />
                {errors.last_name && (
                  <span className="text-red-500 text-sm">{errors.last_name.message}</span>
                )}
              </div>

              {/* Role */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Role</label>
                <input
                  type="text"
                  placeholder="Enter role..."
                  className={inputClass(!!errors.role)}
                  {...register("role", {
                    required: "Role is required",
                    minLength: { value: 3, message: "Role must be at least 3 characters" },
                    pattern: { value: /^[A-Za-z\s]+$/, message: "Only letters and spaces are allowed" },
                  })}
                />
                {errors.role && (
                  <span className="text-red-500 text-sm">{errors.role.message}</span>
                )}
              </div>

              {/* Contact No */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Contact No</label>
                <input
                  type="number"
                  placeholder="Enter contact number..."
                  className={inputClass(!!errors.contact_number)}
                  {...register("contact_number", {
                    required: "Contact Number is required",
                    minLength: { value: 9, message: "Contact number must be at least 9 characters" },
                    pattern: { value: /^[0-9\s]+$/, message: "Only numbers are allowed" },
                  })}
                />
                {errors.contact_number && (
                  <span className="text-red-500 text-sm">{errors.contact_number.message}</span>
                )}
              </div>
            </div>

            <hr className="border-t border-gray-200 mt-6 mb-6" />

            <div className="flex gap-3">
              <button type="submit" className="btn btn-success text-white">
                Add Contact
              </button>
              <button
                type="button"
                className="btn btn-neutral btn-outline"
                onClick={() => navigate("/contacts")}
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