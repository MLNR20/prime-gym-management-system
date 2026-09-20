// @ts-ignore
import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../../components/Sidebar";
import CRUDTemplate from "../../templates/CRUDTemplate";
import useFetchData from "../../data/fetchData";
import Pills from "../../components/Pills";
import formatIsoDate from "../../utils/dateFormat";
import patchUpdateData from "../../data/patchUpdateData";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Alert from "../../components/Alert";
import useCrudAlert from "../../utils/useCrudAlert";
import EditSubscriptionModal, {
  type EditSubscriptionFormData,
} from "../../components/EditSubscriptionModal";

type FormData = EditSubscriptionFormData;

export default function Customer_View(): React.ReactElement {
  const retrieveData = useFetchData({
    url: "customers/show/",
  });
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState<any[]>([]);
  const [selectedRow, setSelectedRow] = useState<FormData | null>(null);
  const editModalRef = useRef<HTMLDialogElement>(null);
  const { alertInfo, setAlertInfo } = useCrudAlert();
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
    editModalRef.current?.showModal();
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
    await patchUpdateData({
      url: `customers/update-subscription`,
      id: formData._id,
      updateData: formData,
    });

    editModalRef.current?.close();

    sessionStorage.setItem(
      "crudAlert",
      JSON.stringify({ message: "Customer subscription updated successfully!", variant: "success" })
    );
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
      header: "Email",
      accessorKey: "email",
      cell: ({ getValue }: any) => getValue() || "—",
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
    <div className="flex background-white h-screen p-6 min-[1025px]:p-0 landscape:min-[1024px]:p-0 min-[1025px]:flex-row landscape:min-[1024px]:flex-row flex-col overflow-hidden">
      {alertInfo && (
        <Alert
          message={alertInfo.message}
          variant={alertInfo.variant}
          onClose={() => setAlertInfo(null)}
        />
      )}

      <div className="w-full min-[1025px]:w-64 landscape:min-[1024px]:w-64">
        <Sidebar />
      </div>

      <EditSubscriptionModal
        ref={editModalRef}
        formKey={selectedRow?._id}
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        onSubmit={onSubmit}
        onClose={() => editModalRef.current?.close()}
      />

      <div className="flex-1 p-6 min-[1025px]:p-24 landscape:min-[1024px]:p-24 overflow-auto">
        <CRUDTemplate
          header="Customer Management"
          Columns={columns}
          Data={customerData}
          ButtonAdditionalString = "Approve"
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
