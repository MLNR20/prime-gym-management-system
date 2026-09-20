import React from "react";
import Sidebar from "../../components/Sidebar";
import Pills from "../../components/Pills";
import CRUDTemplate from "../../templates/CRUDTemplate";
import useFetchData from "../../data/fetchData";
import formatIsoDate from "../../utils/dateFormat";
import Alert from "../../components/Alert";
import useCrudAlert from "../../utils/useCrudAlert";

export default function Equipment_View(): React.ReactElement {
  const retrieveData = useFetchData({ url: "equipment/show/" });
  const { alertInfo, setAlertInfo } = useCrudAlert();

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
      cell: ({ getValue }: any) => formatIsoDate(getValue()),
    },
    {
      header: "Date Updated",
      accessorKey: "updatedAt",
      cell: ({ getValue }: any) => formatIsoDate(getValue()),
    },
  ];

  return (
    <div className="background-white flex h-screen p-6 min-[1025px]:p-0 landscape:min-[1024px]:p-0 min-[1025px]:flex-row landscape:min-[1024px]:flex-row flex-col overflow-hidden">
      {alertInfo && (
        <Alert
          message={alertInfo.message}
          variant={alertInfo.variant}
          onClose={() => setAlertInfo(null)}
        />
      )}

      <div className="w-full min-[1025px]:w-64 landscape:min-[1024px]:w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 min-[1025px]:p-24 landscape:min-[1024px]:p-24 overflow-auto">
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
