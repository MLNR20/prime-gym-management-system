import React from "react";
import Sidebar from "../../components/Sidebar";
import CRUDTemplate from "../../templates/CRUDTemplate";
import useFetchData from "../../data/fetchData";
import formatIsoDate from "../../utils/dateFormat";

export default function Exercise_View(): React.ReactElement {
  const retrieveData = useFetchData({ url: "exercises" });

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
      header: "Exercise Name",
      accessorKey: "exercise_name",
    },
    {
      header: "Target Area",
      accessorKey: "target_area",
    },
    {
      header: "Reps",
      accessorKey: "reps",
    },
    {
      header: "Sets",
      accessorKey: "sets",
    },
    {
      header: "Date Created",
      accessorKey: "createdAt",
      cell: ({ getValue }: any) => formatIsoDate(getValue()),
    },
    {
      header: "Date Updated",
      accessorKey: "updatedAt",
      cell: ({ getValue }: any) => formatIsoDate(getValue()),
    },
  ];

  return (
    <div className="flex background-white h-screen overflow-hidden">
      <div className="w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-24 overflow-auto">
        <CRUDTemplate
          header="Exercise Management"
          Columns={columns}
          Data={retrieveData}
          url="exercises"
          DeleteType="Soft Delete"
          RedirectAddUrl="/add_exercise"
          ButtonString="Add Exercise"
          subheader="Let's manage your exercise library..."
        />
      </div>
    </div>
  );
}
