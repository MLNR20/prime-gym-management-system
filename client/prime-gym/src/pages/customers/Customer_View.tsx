// @ts-ignore
import React from "react";
import Sidebar from "../../components/Sidebar";
import CRUDTemplate from "../../templates/CRUDTemplate";
import useFetchData from "../../data/fetchData";
import Pills from "../../components/Pills";

export default function Customer_View(): React.ReactElement {
  const retrieveData = useFetchData({
    url: "customers/show/",
  });

  const customerData = (retrieveData as any).data;
  console.log(retrieveData);

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
    { header: "Amount Paid", accessorKey: "amount_paid", cell:({getValue}: any) => { return "₱ "+ getValue()} },
    { 
      header: "Status",
      accessorKey: "status" ,
      cell: ({ getValue }: any) => <Pills status={getValue()} />
    },
    { header: "Subscription Type", accessorKey: "subscription_type" },
    { header: "Date Created", accessorKey: "createdAt" },
    { header: "Date Updated", accessorKey: "updatedAt" },
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
          url="customers"
          RedirectAddUrl="/add_customers"
          ButtonString="Add Customer"
          subheader="Let's manage and handle your customers..."
        />
      </div>
    </div>
  );
}
