import React from "react";
import Sidebar from "../../components/Sidebar";
import CRUDTemplate from "../../templates/CRUDTemplate";
import useFetchData from "../../data/fetchData";
import formatIsoDate from "../../utils/dateFormat";
import Alert from "../../components/Alert";
import useCrudAlert from "../../utils/useCrudAlert";

export default function Expense_View(): React.ReactElement {
  const retrieveData = useFetchData({ url: "expenses/show/" });
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
      header: "Expense Title",
      accessorKey: "expense_title",
    },
    {
      header: "Category",
      accessorKey: "categories",
    },
    {
      header: "Quantity",
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
      header: "Due Date",
      accessorKey: "due_date",
      cell: ({ getValue }: any) => (getValue() ? formatIsoDate(getValue()) : "—"),
    },
    {
      header: "Date Added",
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
          header="Expenses Management"
          Columns={columns}
          Data={retrieveData}
          url="expenses"
          DeleteType="Hard Delete"
          RedirectAddUrl="/add_expense"
          ButtonString="Add Expense"
          subheader="Track and manage all gym-related expenses."
        />
      </div>
    </div>
  );
}
