import React from "react";
import Sidebar from "../../components/Sidebar";
import Pills from "../../components/Pills";
import CRUDTemplate from "../../templates/CRUDTemplate";
import useFetchData from "../../data/fetchData";

export default function Inventory_View(): React.ReactElement {
  const retrieveData = useFetchData({ url: "inventory/show/" });

  const columns = [
    {
      header: "#",
      cell: ({ row, table }: any) => {
        const { page = 1, limit = 10 } = table.options.meta ?? {};
        return (page - 1) * limit + row.index + 1;
      },
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
      cell: ({ row }: any) => <Pills status={row.original.status} />,
    },
    {
      header: "For Sale",
      accessorKey: "is_for_sale",
      cell: ({ row }: any) => <Pills status={row.original.is_for_sale ? "Yes" : "No"} />,
    },
    {
      header: "Date Added",
      accessorKey: "createdAt",
      cell: ({ row }: any) =>
        new Date(row.original.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div className="flex h-screen p-6 md:p-0 lg:p-0 lg:flex-row md:flex-row flex-col overflow-hidden">
      <div className="w-full md:w-48 lg:w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 md:p-24 lg:p-24 overflow-auto">
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
