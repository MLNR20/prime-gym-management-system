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
  first_name: string;
  last_name: string;
  role: string;
  contact_number: string;
};

export default function Edit_Contacts(): React.ReactElement {
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
        await updateData({url: "contacts", id:id!.toString() ,updateData: data})

        redirect("/contacts")
        
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
          url: "contacts",
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
            subheader="Hey, there! Let's change your contact!"
            header="Edit Contact"
          />

          <form onSubmit={handleSubmit(onSubmit)} className="w-full my-12">

            {/* FIRST NAME */}
            <div className="flex w-full my-6 flex-col gap-2">
              <label className="label text-black">First Name</label>
              <input
                type="text"
                className={`input input-bordered border-gray-700 bg-white h-12 w-full ${
                  errors.first_name ? "input-error" : ""
                }`}
                {...register("first_name", {
                  required: "First name is required",
                  minLength: {
                    value: 3,
                    message: "Minimum 3 characters",
                  },
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Only letters allowed",
                  },
                })}
              />
              {errors.first_name && (
                <span className="text-red-500 text-sm">
                  {errors.first_name.message}
                </span>
              )}
            </div>

            {/* LAST NAME */}
            <div className="flex w-full my-6 flex-col gap-2">
              <label className="label text-black">Last Name</label>
              <input
                type="text"
                className={`input input-bordered border bg-white border-gray-700 h-12 w-full ${
                  errors.last_name ? "input-error" : ""
                }`}
                {...register("last_name", {
                  required: "Last name is required",
                  minLength: {
                    value: 3,
                    message: "Minimum 3 characters",
                  },
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Only letters allowed",
                  },
                })}
              />
              {errors.last_name && (
                <span className="text-red-500 text-sm">
                  {errors.last_name.message}
                </span>
              )}
            </div>

            {/* ROLE */}
            <div className="flex w-full my-6 flex-col gap-2">
              <label className="label text-black">Role</label>
              <input
                type="text"
                className={`input input-bordered bg-white border-gray-700 h-12 w-full ${
                  errors.role ? "input-error" : ""
                }`}
                {...register("role", {
                  required: "Role is required",
                  minLength: {
                    value: 2,
                    message: "Minimum 2 characters",
                  },
                })}
              />
              {errors.role && (
                <span className="text-red-500 text-sm">
                  {errors.role.message}
                </span>
              )}
            </div>

            {/* CONTACT */}
            <div className="flex w-full my-6 flex-col gap-2">
              <label className="label text-black">Contact No</label>
              <input
                type="text"
                className={`input bg-white border-gray-700 input-bordered h-12 w-full ${
                  errors.contact_number ? "input-error" : ""
                }`}
                {...register("contact_number", {
                  required: "Contact number is required",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Numbers only",
                  },
                })}
              />
              {errors.contact_number && (
                <span className="text-red-500 text-sm">
                  {errors.contact_number.message}
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