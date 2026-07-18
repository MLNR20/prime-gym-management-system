import React from "react";
import Sidebar from "../../components/Sidebar";
import CRUDTemplate from "../../templates/CRUDTemplate";
import useFetchData from "../../data/fetchData";
import updateData from "../../data/updateData";
import Pills from "../../components/Pills";

export default function Attendance_View(): React.ReactElement {
  // Use the paginated "show" endpoint to match how other views fetch lists
 const retrieveData = useFetchData({ url: "attendance/show/" });
 
  const formatTimestamp = (timeStr: string) => {
    if (!timeStr || timeStr === "N/A" || timeStr === "") return "N/A";
    const date = new Date(timeStr);
    if (isNaN(date.getTime())) return timeStr;
    return date.toLocaleString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleCheckOut = async (row: any) => {
    if (row.status === "Returned") {
      alert("This customer has already checked out.");
      return;
    }
    const confirmCheckOut = window.confirm(
      `Are you sure you want to check out ${row.first_name} ${row.last_name}?`
    );
    if (!confirmCheckOut) return;

    try {
      await updateData({
        url: "attendance",
        id: row._id,
        updateData: {},
      });
      alert("Checked out successfully.");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to check out.");
    }
  };

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
      header: "Locker Number",
      accessorKey: "locker_number",
      cell: ({ getValue }: any) => {
        const val = getValue();
        if (Array.isArray(val)) {
          return val[0] ?? "N/A";
        }
        return val ?? "N/A";
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }: any) => <Pills status={getValue()} />,
    },
    {
      header: "Time In",
      accessorKey: "time_in",
      cell: ({ getValue }: any) => formatTimestamp(getValue()),
    },
    {
      header: "Time Out",
      accessorKey: "time_out",
      cell: ({ getValue }: any) => formatTimestamp(getValue()),
    },
  ];

  return (
    <div className="flex background-white h-screen overflow-hidden">
      <div className="w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-24 overflow-auto">
        <CRUDTemplate
          header="Attendance Management"
          Columns={columns}
          ButtonAdditionalString="Check-out"
          additionalFunctionality={handleCheckOut}
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
