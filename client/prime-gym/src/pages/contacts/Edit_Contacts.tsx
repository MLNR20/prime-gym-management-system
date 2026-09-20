import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import ConfirmModal from "../../components/ConfirmModal";
import EditLoadingScreen from "../../components/EditLoadingScreen";
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
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const [loading, setLoading] = useState(true);
  const [pendingData, setPendingData] = useState<FormData | null>(null);
  const modalRef = useRef<HTMLDialogElement>(null);

  const labelClass = "text-sm mb-2 font-medium text-gray-700";
  const inputClass = (hasError: boolean) =>
    `input input-bordered h-12 border bg-white border-gray-400 text-gray-500 placeholder-gray-400 w-full ${hasError ? "input-error" : ""}`;

  const onValidSubmit = (data: FormData) => {
    setPendingData(data);
    modalRef.current?.showModal();
  };

  const confirmSubmit = async () => {
    if (!pendingData) return;
    try {
      await updateData({ url: "contacts", id: id!.toString(), updateData: pendingData });
      modalRef.current?.close();
      navigate("/contacts", {
        state: { alertMessage: "Contact updated successfully!", alertVariant: "success" },
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        setLoading(true);
        const result = await fetchRecord({ url: "contacts", id });
        if (result) {
          reset(result);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, reset]);

  if (loading) {
    return <EditLoadingScreen message="Loading contact..." />;
  }

  return (
    <div className="background-white flex h-screen p-6 min-[1025px]:p-0 landscape:min-[1024px]:p-0 min-[1025px]:flex-row landscape:min-[1024px]:flex-row flex-col overflow-hidden">
      <div className="w-full min-[1025px]:w-64 landscape:min-[1024px]:w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 min-[1025px]:p-24 landscape:min-[1024px]:p-24 overflow-auto">
        <div className="bg-white p-6 sm:p-16 rounded-lg">
          <Header
            subheader="Hey, there! Let's change your contact!"
            header="Edit Contact"
          />

          <form onSubmit={handleSubmit(onValidSubmit)} className="w-full mt-10">

            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                Contact Info
              </span>
              <hr className="flex-1 border-gray-300" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="flex flex-col gap-1">
                <label className={labelClass}>First Name</label>
                <input
                  type="text"
                  placeholder="Enter first name..."
                  className={inputClass(!!errors.first_name)}
                  {...register("first_name", {
                    required: "First name is required",
                    minLength: { value: 3, message: "Minimum 3 characters" },
                    pattern: { value: /^[A-Za-z\s]+$/, message: "Only letters allowed" },
                  })}
                />
                {errors.first_name && (
                  <span className="text-red-500 text-sm">{errors.first_name.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Last Name</label>
                <input
                  type="text"
                  placeholder="Enter last name..."
                  className={inputClass(!!errors.last_name)}
                  {...register("last_name", {
                    required: "Last name is required",
                    minLength: { value: 3, message: "Minimum 3 characters" },
                    pattern: { value: /^[A-Za-z\s]+$/, message: "Only letters allowed" },
                  })}
                />
                {errors.last_name && (
                  <span className="text-red-500 text-sm">{errors.last_name.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Role</label>
                <input
                  type="text"
                  placeholder="Enter role..."
                  className={inputClass(!!errors.role)}
                  {...register("role", {
                    required: "Role is required",
                    minLength: { value: 2, message: "Minimum 2 characters" },
                  })}
                />
                {errors.role && (
                  <span className="text-red-500 text-sm">{errors.role.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Contact No</label>
                <input
                  type="text"
                  placeholder="Enter contact number..."
                  className={inputClass(!!errors.contact_number)}
                  {...register("contact_number", {
                    required: "Contact number is required",
                    pattern: { value: /^[0-9]+$/, message: "Numbers only" },
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
                Update Contact
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

          <ConfirmModal
            ref={modalRef}
            title="Confirm Update"
            message={
              <>
                Are you sure you want to save these changes to{" "}
                <span className="font-semibold">
                  {pendingData?.first_name} {pendingData?.last_name}
                </span>
                's contact info?
              </>
            }
            confirmLabel="Yes, Update"
            onConfirm={confirmSubmit}
          />
        </div>
      </div>
    </div>
  );
}