import React from "react";
import Sidebar from "../../components/Sidebar";
import CRUDTemplate from "../../templates/CRUDTemplate";
import useFetchData from "../../data/fetchData";

export default function Sales_View(): React.ReactElement {
  const retrieveData = useFetchData({ url: "sales/show/" });

  const columns = [
    {
      header: "#",
      cell: ({ row }: any) => row.index + 1,
    },
    {
      header: "Customer",
      accessorFn: (row: any) => `${row.first_name ?? "N/A"} ${row.last_name ?? ""}`.trim(),
    },
    {
      header: "Item Code",
      accessorKey: "item_code",
    },
    {
      header: "Item Name",
      accessorKey: "item_name",
    },
    {
      header: "Qty Sold",
      accessorKey: "quantity",
    },
    {
      header: "Total Price",
      accessorKey: "total_price",
      cell: ({ row }: any) =>
        `₱${Number(row.original.total_price).toLocaleString("en-PH", {
          minimumFractionDigits: 2,
        })}`,
    },
    {
      header: "Status",
      accessorKey: "is_active",
      cell: ({ row }: any) => (
        <span
          className={`badge ${row.original.is_active ? "badge-success text-white" : "badge-neutral text-white"}`}
        >
          {row.original.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Date Sold",
      accessorKey: "createdAt",
      cell: ({ row }: any) =>
        new Date(row.original.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-24 overflow-auto">
        <CRUDTemplate
          header="Sales Management"
          Columns={columns}
          Data={retrieveData}
          url="sales"
          DeleteType="Hard Delete"
          RedirectAddUrl="/add_sales"
          ButtonString="New Sale"
          subheader="Track and manage all inventory sales."
        />
      </div>
    </div>
  );
}
