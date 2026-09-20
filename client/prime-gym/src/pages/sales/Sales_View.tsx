import React from "react";
import Sidebar from "../../components/Sidebar";
import Pills from "../../components/Pills";
import CRUDTemplate from "../../templates/CRUDTemplate";
import useFetchData from "../../data/fetchData";
import formatIsoDate from "../../utils/dateFormat";
import Alert from "../../components/Alert";
import useCrudAlert from "../../utils/useCrudAlert";

export default function Sales_View(): React.ReactElement {
  const retrieveData = useFetchData({ url: "sales/show/" });
  const { alertInfo, setAlertInfo } = useCrudAlert();

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
        <Pills status={row.original.is_active ? "Active" : "Inactive"} />
      ),
    },
    {
      header: "Date Sold",
      accessorKey: "createdAt",
      cell: ({ getValue }: any) => formatIsoDate(getValue()),
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
