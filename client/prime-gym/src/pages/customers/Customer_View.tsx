// @ts-ignore
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import CRUDTemplate from "../../templates/CRUDTemplate";
import useFetchData from "../../data/fetchData";
import Pills from "../../components/Pills";
import formatIsoDate from "../../utils/dateFormat";
import { useNavigate } from "react-router-dom";
import Alert from "../../components/Alert";
import useCrudAlert from "../../utils/useCrudAlert";

export default function Customer_View(): React.ReactElement {
  const retrieveData = useFetchData({
    url: "customers/show/",
  });
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState<any[]>([]);
  const { alertInfo, setAlertInfo } = useCrudAlert();

  const approveForm = (row: any) => {
    navigate(`/customers/${row._id}/subscription`);
  };

  useEffect(() => {
    setCustomerData(retrieveData);
  }, [retrieveData]);

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
    <div className="background-white flex h-screen p-6 min-[1025px]:p-0 landscape:min-[1024px]:p-0 min-[1025px]:flex-row landscape:min-[1024px]:flex-row flex-col overflow-hidden">
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
