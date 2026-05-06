import React from "react";
import Sidebar from "../../components/Sidebar";
import useFetchData from "../../data/fetchData";
import TableTemplate from "../../templates/TableTemplate";
import Pills from "../../components/Pills";
export default function Admin_View(): React.ReactElement {
  const retrieveData = useFetchData({ url: "admin" });

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
      header: "Full Name",
      accessorFn: (row: any) => `${row.first_name} ${row.last_name}`,
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "isDeleted",
      accessorKey: "isDeleted",
      cell: ({ getValue }: any) => <Pills status={getValue().toString()} />,
    },

    {
      header: "Date Created",
      accessorKey: "createdAt",
    },
  ];

  console.log(retrieveData);

  return (
    <div className="flex background-white h-screen overflow-hidden">
      <div className="w-64">
        <Sidebar />
      </div>
      <div className="flex-1 p-24 overflow-auto">
        <TableTemplate
          header="Admin Management"
          Url="admin"
          Columns={columns}
          Data={retrieveData}
          subheader="Manage user access of your system..."
        />
      </div>
    </div>
  );
}
