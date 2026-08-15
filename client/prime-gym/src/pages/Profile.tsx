import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Tables from "../components/Tables";
import useFetchData from "../data/fetchData";

interface LogEntry {
  _id: string;
  admin_id: string;
  logs: string;
  createdAt: string;
}

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

  const logsData = useFetchData({ url: "logs/show/", limit: 100 });
  const loginHistory: LogEntry[] = (logsData.data ?? []).filter(
    (entry: LogEntry) =>
      entry.admin_id === admin?.id && entry.logs.includes("logged in")
  );

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
      cell: ({ row }: any) => row.index + 1,
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
    <div className="flex background-white h-screen p-6 md:p-0 lg:p-0 lg:flex-row md:flex-row flex-col overflow-hidden">
      <div className="w-full md:w-48 lg:w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 md:p-24 lg:p-24 overflow-auto">
        <div className="bg-white p-16 gap-3 flex flex-col rounded-lg">
          <Header
            header="Profile"
            subheader={`Welcome, ${admin?.first_name ?? ""} ${admin?.last_name ?? ""}`}
          />

          <h3 className="text-lg font-bold mt-8 mb-2">Login Information</h3>
          <Tables
            data={loginHistory}
            columns={loginHistoryColumns}
            url="logs"
            disableFetch
          />
        </div>
      </div>
    </div>
  );
}
