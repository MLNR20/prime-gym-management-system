import React from "react";
import Sidebar from "../../components/Sidebar";
import CRUDTemplate from "../../templates/CRUDTemplate";
import useFetchData from "../../data/fetchData";

export default function Equipment_View(): React.ReactElement {
  const retrieveData = useFetchData({ url: "equipment/show/" });
  console.log(retrieveData);
  const columns = [
    {
      header: "#",
      cell: ({ row }: any) => row.index + 1,
    },
    {
      header: "Equipment",
      accessorKey: "equipment_name",
    },
    {
      header: "Status",
      accessorKey: "equipment_status",
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
          header="Equipment Management"
          Columns={columns}
          Data={retrieveData}
          url="equipment"
          DeleteType="Hard Delete"
          RedirectAddUrl="/add_equipment"
          ButtonString="Add Equipment"
          subheader="Let's manage and handle your gym equipment..."
        />
      </div>
    </div>
  );
}
