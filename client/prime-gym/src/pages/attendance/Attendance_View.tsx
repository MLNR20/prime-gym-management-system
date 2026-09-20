import React, { useRef, useState } from "react";
import Sidebar from "../../components/Sidebar";
import CRUDTemplate from "../../templates/CRUDTemplate";
import useFetchData from "../../data/fetchData";
import updateData from "../../data/updateData";
import Pills from "../../components/Pills";
import Alert from "../../components/Alert";
import ConfirmModal from "../../components/ConfirmModal";
import useCrudAlert from "../../utils/useCrudAlert";

export default function Attendance_View(): React.ReactElement {
  // Use the paginated "show" endpoint to match how other views fetch lists
 const retrieveData = useFetchData({ url: "attendance/show/" });
 const { alertInfo, setAlertInfo } = useCrudAlert();
 const [pendingCheckOut, setPendingCheckOut] = useState<any | null>(null);
 const checkOutModalRef = useRef<HTMLDialogElement>(null);

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

  const handleCheckOut = (row: any) => {
    if (row.status === "Returned") {
      setAlertInfo({ message: "This customer has already checked out.", variant: "error" });
      return;
    }
    setPendingCheckOut(row);
    checkOutModalRef.current?.showModal();
  };

  const confirmCheckOut = async () => {
    if (!pendingCheckOut) return;
    try {
      await updateData({
        url: "attendance",
        id: pendingCheckOut._id,
        updateData: {},
      });
      checkOutModalRef.current?.close();
      sessionStorage.setItem(
        "crudAlert",
        JSON.stringify({ message: "Checked out successfully.", variant: "success" })
      );
      window.location.reload();
    } catch (error) {
      console.error(error);
      checkOutModalRef.current?.close();
      setAlertInfo({ message: "Failed to check out.", variant: "error" });
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
    <div className="flex background-white h-screen p-6 min-[1025px]:p-0 landscape:min-[1024px]:p-0 min-[1025px]:flex-row landscape:min-[1024px]:flex-row flex-col overflow-hidden">
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

      <ConfirmModal
        ref={checkOutModalRef}
        title="Confirm Check-out"
        message={
          <>
            Are you sure you want to check out{" "}
            <span className="font-semibold">
              {pendingCheckOut?.first_name} {pendingCheckOut?.last_name}
            </span>
            ?
          </>
        }
        confirmLabel="Yes, Check-out"
        onConfirm={confirmCheckOut}
      />
    </div>
  );
}
