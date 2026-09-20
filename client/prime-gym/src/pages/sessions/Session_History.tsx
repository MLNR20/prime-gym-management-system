import React from "react";
import Sidebar from "../../components/Sidebar";
import TableTemplate from "../../templates/TableTemplate";
import formatIsoDate from "../../utils/dateFormat";

export default function Session_History(): React.ReactElement {
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
      header: "Session Consumed",
      cell: () => "1 session",
    },
    {
      header: "Program Assigned",
      accessorKey: "program_name",
      cell: ({ getValue }: any) => getValue() ?? "N/A",
    },
    {
      header: "Balance After",
      accessorKey: "session_balance_after",
    },
    {
      header: "Date Assigned",
      accessorKey: "assigned_at",
      cell: ({ getValue }: any) => formatIsoDate(getValue()),
    },
  ];

  return (
    <div className="flex background-white h-screen p-6 min-[1025px]:p-0 landscape:min-[1024px]:p-0 min-[1025px]:flex-row landscape:min-[1024px]:flex-row flex-col overflow-hidden">
      <div className="w-full min-[1025px]:w-64 landscape:min-[1024px]:w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 min-[1025px]:p-24 landscape:min-[1024px]:p-24 overflow-auto">
        <TableTemplate
          header="Session History"
          subheader="Read-only record of consumed sessions and the programs assigned to each customer."
          Url="session-assignments"
          Columns={columns}
          Data={[]}
        />
      </div>
    </div>
  );
}
