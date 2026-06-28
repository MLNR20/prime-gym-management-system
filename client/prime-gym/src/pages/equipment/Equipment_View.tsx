import React from "react";
import Sidebar from "../../components/Sidebar";
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
      cell: ({ row }: any) => {
        const status = row.original.equipment_status;
        const colorMap: Record<string, string> = {
          Active: "badge-success text-white",
          Inactive: "badge-neutral text-white",
          "For Repair": "badge-warning text-white",
          "Under Repair": "badge-error text-white",
        };
        return (
          <span className={`badge ${colorMap[status] ?? "badge-ghost"}`}>
            {status}
          </span>
        );
      },
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
    <div className="flex background-white h-screen overflow-hidden">
      <div className="w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-24 overflow-auto">
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
