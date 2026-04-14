import React from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useForm } from "react-hook-form";
import createData from "../../data/createData";
import { useNavigate } from "react-router-dom";
type FormData = {
  first_name: string;
  last_name: string;
  amount_paid: string;
  contact_no: string;
  status: string;
  subscription_type: string;
  payment_option: string;
};

export default function Edit_Customer(): React.ReactElement {
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
      const createCustomer = await createData({ url: "customers", data: data });
      console.log(createCustomer)
      if(createCustomer)
      {
      alert("Redirect");

      }
      usenavigate("/customers");
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
            subheader="Hey, there! Let's create a new customer!"
            header="Add Customer"
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
                <span className="label-text text-black">Amount Paid</span>
              </label>
              <input
                type="number"
                placeholder="Enter your password..."
                className={`input input-bordered h-12 border bg-white border-gray-700 w-full ${
                  errors.amount_paid ? "input-error" : ""
                }`}
                {...register("amount_paid", {
                  required: "Amount Paid is required",
                  min: {
                    value: 1,
                    message: "Amount Paid must be greater than 0 pesos",
                  },
                  pattern: {
                    value: /^[0-9\s]+$/,
                    message: "Only numbers are allowed",
                  },
                })}
              />
              {errors.amount_paid && (
                <span className="text-red-500 text-sm">
                  {errors.amount_paid.message}
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
                  errors.contact_no ? "input-error" : ""
                }`}
                {...register("contact_no", {
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
              {errors.contact_no && (
                <span className="text-red-500 text-sm">
                  {errors.contact_no.message}
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
                {...register("subscription_type", {
                  required: "Subscription status is required",
                })}
              >
                <option value="" disabled>
                  Pick a subscription option
                </option>
                <option value="Daily Exercise">Daily Exercise</option>
                <option value="Monthly Subscription">
                  Monthly Subscription
                </option>
                <option value="Coaching Subscription">
                  Coaching Subscription
                </option>
                <option value="Monthly with Coaching">
                  {" "}
                  Monthly With Coaching
                </option>
              </select>

              {errors.subscription_type && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.subscription_type.message}
                </p>
              )}
            </div>

            <div className="flex w-full my-6 flex-col gap-2">
              <label className="label">
                <span className="label-text text-black">Payment Option</span>
              </label>
              <select
                defaultValue=""
                className="select select-bordered h-12 border bg-white border-gray-700 w-full"
                {...register("payment_option", {
                  required: "Payment option is required",
                })}
              >
                <option value="" disabled>
                  Pick a payment option
                </option>
                <option value="Cash">Cash</option>
                <option value="GCash">GCash</option>
              </select>

              {errors.payment_option && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.payment_option.message}
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
