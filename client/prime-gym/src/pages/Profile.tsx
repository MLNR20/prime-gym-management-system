import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Tables from "../components/Tables";
import useFetchData from "../data/fetchData";
import formatIsoDate from "../utils/dateFormat";

interface DecodedToken {
  id: string;
  first_name: string;
  last_name: string;
}

function decodeToken(token: string | null): DecodedToken | null {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default function Profile(): React.ReactElement {
  const token = localStorage.getItem("token");
  const admin = decodeToken(token);
  const adminProfile = useFetchData({ url: "admin/me" });

  const formatTimestamp = (timeStr: string) => {
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

  const loginHistoryColumns = [
    {
      header: "#",
      cell: ({ row, table }: any) => {
        const page = table.options.meta?.page ?? 1;
        const limit = table.options.meta?.limit ?? 10;
        return (page - 1) * limit + row.index + 1;
      },
    },
    {
      header: "Details",
      accessorKey: "logs",
    },
    {
      header: "Date & Time",
      accessorKey: "createdAt",
      cell: ({ getValue }: any) => formatTimestamp(getValue()),
    },
  ];

  return (
    <div className="background-white flex h-screen p-6 min-[1025px]:p-0 landscape:min-[1024px]:p-0 min-[1025px]:flex-row landscape:min-[1024px]:flex-row flex-col overflow-hidden">
      <div className="w-full min-[1025px]:w-64 landscape:min-[1024px]:w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 min-[1025px]:p-24 landscape:min-[1024px]:p-24 overflow-auto">
        <div className="bg-white p-16 gap-3 flex flex-col rounded-lg">
          <Header
            header="Profile"
            subheader={`Welcome, ${admin?.first_name ?? ""} ${admin?.last_name ?? ""}`}
          />

          {adminProfile?.createdAt && (
            <p className="text-gray-500">
              Date Joined: {formatIsoDate(adminProfile.createdAt)}
            </p>
          )}

          <h3 className="text-lg font-bold mt-8 mb-2">Login Information</h3>
          <Tables data={[]} columns={loginHistoryColumns} url="logs" />
        </div>
      </div>
    </div>
  );
}
