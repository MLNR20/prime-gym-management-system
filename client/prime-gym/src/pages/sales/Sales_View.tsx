import React from "react";
import Sidebar from "../../components/Sidebar";
import CRUDTemplate from "../../templates/CRUDTemplate";
import useFetchData from "../../data/fetchData";
import formatIsoDate from "../../utils/dateFormat";

export default function Sales_View(): React.ReactElement {
  const retrieveData = useFetchData({ url: "sales/show/" });

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
      cell: ({ getValue }: any) => formatIsoDate(getValue()),
    },
  ];

  return (
    <div className="flex h-screen p-6 md:p-0 lg:p-0 lg:flex-row md:flex-row flex-col overflow-hidden">
      <div className="w-full md:w-48 lg:w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 md:p-24 lg:p-24 overflow-auto">
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
