import React from "react";
import Sidebar from "../../components/Sidebar";
import CRUDTemplate from "../../templates/CRUDTemplate";
import useFetchData from "../../data/fetchData";

export default function Inventory_View(): React.ReactElement {
  const retrieveData = useFetchData({ url: "inventory/show/" });

  const columns = [
    {
      header: "#",
      cell: ({ row }: any) => row.index + 1,
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
      header: "Category",
      accessorKey: "category",
    },
    {
      header: "Qty",
      accessorKey: "quantity",
    },
    {
      header: "Unit Price",
      accessorKey: "unit_price",
      cell: ({ row }: any) =>
        `₱${Number(row.original.unit_price).toLocaleString("en-PH", {
          minimumFractionDigits: 2,
        })}`,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }: any) => {
        const status = row.original.status;
        const colorMap: Record<string, string> = {
          Available: "badge-success text-white",
          "Low Stock": "badge-warning text-white",
          "Out of Stock": "badge-error text-white",
          Discontinued: "badge-neutral text-white",
        };
        return (
          <span className={`badge ${colorMap[status] ?? "badge-ghost"}`}>
            {status}
          </span>
        );
      },
    },
    {
      header: "For Sale",
      accessorKey: "is_for_sale",
      cell: ({ row }: any) => (
        <span
          className={`badge ${row.original.is_for_sale ? "badge-info text-white" : "badge-ghost"}`}
        >
          {row.original.is_for_sale ? "Yes" : "No"}
        </span>
      ),
    },
    {
      header: "Date Added",
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
          header="Inventory Management"
          Columns={columns}
          Data={retrieveData}
          url="inventory"
          DeleteType="Hard Delete"
          RedirectAddUrl="/add_inventory"
          ButtonString="Add Item"
          subheader="Track and manage all gym inventory items."
        />
      </div>
    </div>
  );
}
