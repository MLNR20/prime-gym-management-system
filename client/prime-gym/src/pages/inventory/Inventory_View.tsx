import React from "react";
import Sidebar from "../../components/Sidebar";
import Pills from "../../components/Pills";
import CRUDTemplate from "../../templates/CRUDTemplate";
import useFetchData from "../../data/fetchData";
import Alert from "../../components/Alert";
import useCrudAlert from "../../utils/useCrudAlert";

export default function Inventory_View(): React.ReactElement {
  const retrieveData = useFetchData({ url: "inventory/show/" });
  const { alertInfo, setAlertInfo } = useCrudAlert();

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
