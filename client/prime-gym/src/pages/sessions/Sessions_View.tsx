import React from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import CRUDTables from "../../components/CRUD_Tables";
import useFetchData from "../../data/fetchData";
import formatIsoDate from "../../utils/dateFormat";
import { Link } from "react-router-dom";

export default function Sessions_View(): React.ReactElement {
  const retrieveData = useFetchData({ url: "sessions/show/" });

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
    <div className="flex h-screen p-6 md:p-0 lg:p-0 lg:flex-row md:flex-row flex-col overflow-hidden">
      <div className="w-full md:w-48 lg:w-64">
        <Sidebar />
      </div>
      <div className="flex-1 p-6 md:p-24 lg:p-24 overflow-auto">
        <div className="bg-white p-16 gap-3 flex flex-col rounded-lg">
          <Header
            header="Coaching Sessions"
            subheader="Read-only record of coaching sessions granted to customers."
          />
          <Link className="btn btn-primary text-white mb-4 mt-4 w-fit" to="/sessions/assign">
            Assign Sessions
          </Link>
          <CRUDTables
            data={retrieveData}
            url="sessions"
            deleteType="Hard Delete"
            columns={columns}
          />
        </div>
      </div>
    </div>
  );
}
