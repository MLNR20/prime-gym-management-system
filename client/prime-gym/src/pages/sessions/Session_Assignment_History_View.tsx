import React from "react";
import Sidebar from "../../components/Sidebar";
import TableTemplate from "../../templates/TableTemplate";
import { Link } from "react-router-dom";
import formatIsoDate from "../../utils/dateFormat";

export default function Session_Assignment_History_View(): React.ReactElement {
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
    { header: "Program Assigned", accessorKey: "program_name" },
    { header: "Sessions Remaining", accessorKey: "session_balance_after" },
    {
      header: "Date Assigned",
      accessorKey: "assigned_at",
      cell: ({ getValue }: any) => formatIsoDate(getValue()),
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-64">
        <Sidebar />
      </div>
      <div className="flex-1 p-24 overflow-auto">
        <div className="flex justify-end mb-4">
          <Link className="btn btn-ghost" to="/sessions/assign">
            Back to Assign Sessions
          </Link>
        </div>
        <TableTemplate
          header="Session Assignment History"
          subheader="Read-only record of which program was assigned to each customer's session."
          Columns={columns}
          Data={[]}
          Url="session-assignments"
        />
      </div>
    </div>
  );
}
