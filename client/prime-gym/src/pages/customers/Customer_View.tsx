// @ts-ignore
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import CRUDTemplate from "../../templates/CRUDTemplate";
import useFetchData from "../../data/fetchData";
import Pills from "../../components/Pills";
import formatIsoDate from "../../utils/dateFormat";
import patchUpdateData from "../../data/patchUpdateData";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
type FormData = {
  _id: string;
  amount_paid: number;
  subscription_type: string;
  payment_option: string;
};

export default function Customer_View(): React.ReactElement {
  const retrieveData = useFetchData({
    url: "customers/show/",
  });
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState<any[]>([]);
  const [selectedRow, setSelectedRow] = useState<FormData | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      _id: "",
      amount_paid: 0,
      subscription_type: "",
      payment_option: "",
    },
  });

  const approveForm = async (row: any) => {
    console.log("Selected Row:", row);
    setSelectedRow(row);
    const modal = document.getElementById("modal_approve");
    if (modal instanceof HTMLDialogElement) modal.showModal();
  };

  useEffect(() => {
    setCustomerData(retrieveData);
    if (selectedRow) {
      reset({
        _id: selectedRow._id,
        amount_paid: Number(selectedRow.amount_paid) || 0,
        subscription_type: selectedRow.subscription_type || "",
        payment_option: selectedRow.payment_option || "",
      });
    }
  }, [selectedRow, reset]);

  console.log(retrieveData);

  const onSubmit = async (formData: FormData) => {
    console.log("Sbmit", formData);

    await patchUpdateData({
      url: `customers/update-subscription`,
      id: formData._id,
      updateData: formData,
    });

    alert("Sibmitted");
    navigate(0);
  };

  const columns = [
    {
      header: "#",
      cell: ({ row, table }: any) => {
        const page = table.options.meta?.page ?? 1;
        const limit = table.options.meta?.limit ?? 10;
        return (page - 1) * limit + row.index + 1;
      },
    },
    {
      header: "Full Name",
      accessorFn: (row: any) => `${row.first_name} ${row.last_name}`,
    },
    {
      header: "Payment Option",
      accessorKey: "payment_option",
    },
    {
      header: "Amount Paid",
      accessorKey: "amount_paid",
      cell: ({ getValue }: any) => {
        return "₱ " + getValue();
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }: any) => <Pills status={getValue()} />,
    },
    { header: "Subscription Type", accessorKey: "subscription_type" },
    {
      header: "Payment Date",
      accessorKey: "payment_Date",
      cell: ({ getValue }: any) => {
        return formatIsoDate(getValue());
      },
    },
    {
      header: "Expiration Date",
      accessorKey: "expiration_Date",
      cell: ({ getValue }: any) => {
        return formatIsoDate(getValue());
      },
    },
    {
      header: "Date Created",
      accessorKey: "createdAt",
      cell: ({ getValue }: any) => {
        return formatIsoDate(getValue());
      },
    },
    {
      header: "Date Updated",
      accessorKey: "updatedAt",
      cell: ({ getValue }: any) => {
        return formatIsoDate(getValue());
      },
    },
  ];

  if (!retrieveData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex background-white h-screen overflow-hidden">
      <div className="w-64">
        <Sidebar />
      </div>

      <dialog
        id="modal_approve"
        className="modal  modal-bottom sm:modal-middle"
      >
        <div className="modal-box bg-white">
          <h3 className="font-bold text-lg">Edit Details</h3>
          <p className="py-4">Edit transaction details here...</p>
          <div className="modal-action flex-col">
            <form key={selectedRow?._id} onSubmit={handleSubmit(onSubmit)}>
              <div className="w-full">
                <input type="hidden" {...register("_id")} />
                <div className="flex w-full flex-col gap-2">
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
                      valueAsNumber: true,
                      min: {
                        value: 1,
                        message: "Amount Paid must be greater than 0 pesos",
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
                    <span className="label-text text-black">
                      Subscription Status
                    </span>
                  </label>

                  <select
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
                    <span className="label-text text-black">
                      Payment Option
                    </span>
                  </label>
                  <select
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
              </div>

              <div className="gap-2 flex flex-row">
                <button type="submit" className="btn btn-success text-white">
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const modal = document.getElementById("modal_approve");
                    if (modal instanceof HTMLDialogElement) modal.close();
                  }}
                  className="btn btn-outline"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>

      <div className="flex-1 p-24 overflow-auto">
        <CRUDTemplate
          header="Customer Management"
          Columns={columns}
          Data={customerData}
          additionalFunctionality={approveForm}
          url="customers"
          DeleteType="Soft Delete"
          RedirectAddUrl="/add_customers"
          ButtonString="Add Customer"
          subheader="Let's manage and handle your customers..."
        />
      </div>
    </div>
  );
}
