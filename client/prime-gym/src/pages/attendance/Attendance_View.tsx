

import React from "react";
import Sidebar from "../../components/Sidebar";
import CRUDTemplate from "../../templates/CRUDTemplate";
import useFetchData from "../../data/fetchData";

export default function Attendance_View(): React.ReactElement {
  const retrieveData = useFetchData({ url: "attendance" });

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
      header: "First Name",
      accessorKey: "first_name",
    },
    {
      header: "Last Name",
      accessorKey: "last_name",
    },
    {
      header: "Contact Number",
      accessorKey: "contact_number",
    },
    {
      header: "Role",
      accessorKey: "role",
    },

    {
      header: "Date Created",
      accessorKey: "createdAt",
    },
    {
      header: "Date Updated",
      accessorKey: "updatedAt",
    },
  ];
  return (
    <div className="flex background-white  h-screen overflow-hidden">
      <div className="w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-24   overflow-auto">
        <CRUDTemplate
          header="Attendance Management"
          Columns={columns}
          ButtonAdditionalString = "Check-out"
          Data={retrieveData}
          DeleteType="Hard Delete"
          url="attendance"
          RedirectAddUrl="/add_attendance"
          ButtonString="Add Attendance"
          subheader="Let's handle your client's attendance..."
        />
      </div>
    </div>
  );
}
