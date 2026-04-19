import React from "react";
import Sidebar from "../../components/Sidebar";
import CRUDTemplate from "../../templates/CRUDTemplate";
import useFetchData from "../../data/fetchData";

export default function Locker_View(): React.ReactElement {
  const retrieveData = useFetchData({ url: "lockers" });

  const columns = [
    {
      header: "#",
      cell: ({ row }: any) => row.index + 1,
    },
    {
      header: "Keys",
      accessorKey: "locker_number",
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
          header="Locker Management"
          Columns={columns}
          Data={retrieveData}
          url="lockers"
          RedirectAddUrl="/add_locker"
          ButtonString="Add Locker"
          subheader="Let's manage and handle your lockers..."
        />
      </div>
    </div>
  );
}
