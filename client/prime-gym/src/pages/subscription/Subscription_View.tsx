// @ts-ignore
import React, {useEffect, useState} from "react";
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

  const onSubmit =async (formData: FormData) => {
    console.log("Sbmit", formData);

       await patchUpdateData({
              url: `customers/update-subscription`,
              id: formData._id,
              updateData: formData,
            });

    alert("Sibmitted")
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

      <div className="flex-1 p-24 overflow-auto">
        <CRUDTemplate
          header="Customer Management"
          Columns={columns}
          Data={customerData}
          additionalFunctionality={approveForm}
          url="customers"
          RedirectAddUrl="/add_customers"
          ButtonString="Add Customer"
          subheader="Let's manage and handle your customers..."
        />
      </div>
    </div>
  );
}
