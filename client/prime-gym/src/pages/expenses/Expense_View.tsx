import React from "react";
import Sidebar from "../../components/Sidebar";
import CRUDTemplate from "../../templates/CRUDTemplate";
import useFetchData from "../../data/fetchData";
import formatIsoDate from "../../utils/dateFormat";

export default function Expense_View(): React.ReactElement {
  const retrieveData = useFetchData({ url: "expenses/show/" });

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
    <div className="flex h-screen overflow-hidden">
      <div className="w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-24 overflow-auto">
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
