import React from "react";
import Sidebar from "../../components/Sidebar";
import CRUDTemplate from "../../templates/CRUDTemplate";
import useFetchData from "../../data/fetchData";

type Customer = {
  _id: string;
  first_name: string;
  last_name: string;
  amount_paid: number;
  status: string;
  subscription_type: string;
  createdAt: string;
  updatedAt: string;
};

export default function Customer_View(): React.ReactElement {
  const retrieveData = useFetchData({
    url: "customers/show/",
  }) as Customer[];

  console.log(retrieveData);

  const columns = [
    {
      header: "#",
      cell: ({ row }: any) => row.index + 1,
    },
    { header: "First Name", accessorKey: "first_name" },
    { header: "Last Name", accessorKey: "last_name" },
    { header: "Amount Paid", accessorKey: "amount_paid" },
    { header: "Status", accessorKey: "status" },
    { header: "Subscription Type", accessorKey: "subscription_type" },
    { header: "Date Created", accessorKey: "createdAt" },
    { header: "Date Updated", accessorKey: "updatedAt" },
  ];

  return (
    <div className="flex background-white h-screen overflow-hidden">
      <div className="w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-24 overflow-auto">
        <CRUDTemplate
          header="Customer Management"
          Columns={columns}
          Data={retrieveData}
          url="customers"
          RedirectAddUrl="/add_customers"
          ButtonString="Add Customer"
          subheader="Let's manage and handle your customers..."
        />
      </div>
    </div>
  );
}