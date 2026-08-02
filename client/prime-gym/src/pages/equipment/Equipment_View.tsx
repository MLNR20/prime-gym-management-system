import React from "react";
import Sidebar from "../../components/Sidebar";
import Pills from "../../components/Pills";
import CRUDTemplate from "../../templates/CRUDTemplate";
import useFetchData from "../../data/fetchData";

export default function Equipment_View(): React.ReactElement {
  const retrieveData = useFetchData({ url: "equipment/show/" });

  const columns = [
    {
      header: "#",
      cell: ({ row }: any) => row.index + 1,
    },
    {
      header: "Equipment Name",
      accessorKey: "equipment_name",
    },
    {
      header: "Status",
      accessorKey: "equipment_status",
      cell: ({ row }: any) => <Pills status={row.original.equipment_status} />,
    },
    {
      header: "Date Created",
      accessorKey: "createdAt",
      cell: ({ row }: any) =>
        new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      header: "Date Updated",
      accessorKey: "updatedAt",
      cell: ({ row }: any) =>
        new Date(row.original.updatedAt).toLocaleDateString(),
    },
  ];

  return (
    <div className="flex background-white h-screen p-6 md:p-0 lg:p-0 lg:flex-row md:flex-row flex-col overflow-hidden">
      <div className="w-full md:w-48 lg:w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 md:p-24 lg:p-24 overflow-auto">
        <CRUDTemplate
          header="Equipment Management"
          Columns={columns}
          Data={retrieveData}
          url="equipment"
          DeleteType="Hard Delete"
          RedirectAddUrl="/add_equipment"
          ButtonString="Add Equipment"
          subheader="Manage and track all your gym equipment here."
        />
      </div>
    </div>
  );
}
