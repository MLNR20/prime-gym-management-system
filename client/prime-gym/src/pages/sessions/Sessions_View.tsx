import React from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Tables from "../../components/Tables";
import formatIsoDate from "../../utils/dateFormat";
import { Link } from "react-router-dom";

export default function Sessions_View(): React.ReactElement {
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
    { header: "Session Balance", accessorKey: "session_balance" },
    {
      header: "Date Created",
      accessorKey: "created_at",
      cell: ({ getValue }: any) => formatIsoDate(getValue()),
    },
  ];

  return (
    <div className="flex h-screen p-6 min-[1025px]:p-0 landscape:min-[1024px]:p-0 min-[1025px]:flex-row landscape:min-[1024px]:flex-row flex-col overflow-hidden">
      <div className="w-full min-[1025px]:w-64 landscape:min-[1024px]:w-64">
        <Sidebar />
      </div>
      <div className="flex-1 p-6 min-[1025px]:p-24 landscape:min-[1024px]:p-24 overflow-auto">
        <div className="bg-white p-6 sm:p-16 gap-3 flex flex-col rounded-lg">
          <Header
            header="Coaching Sessions"
            subheader="Read-only record of coaching sessions granted to customers."
          />
          <div className="flex flex-col min-[1025px]:flex-row landscape:min-[1024px]:flex-row gap-2 mb-4 mt-4">
            <Link className="btn btn-primary text-white w-fit" to="/sessions/assign">
              Assign Sessions
            </Link>
            <Link className="btn btn-ghost w-fit" to="/sessions/history">
              Session History
            </Link>
          </div>
          <Tables data={[]} url="sessions" columns={columns} />
        </div>
      </div>
    </div>
  );
}
