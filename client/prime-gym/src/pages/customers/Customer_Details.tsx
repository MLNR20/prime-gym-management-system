import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Pills from "../../components/Pills";
import TableTemplate from "../../templates/TableTemplate";
import fetchRecord from "../../data/fetchRecord";
import { useFetchDataWithStatus } from "../../data/fetchData";
import formatIsoDate from "../../utils/dateFormat";
import EmptyState from "../../components/EmptyState";
import HeaderMd from "../../components/HeadersMd";
import { CalendarX2 } from "lucide-react";

type Params = {
  id: string;
};

function formatTimestamp(timeStr: string) {
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
}

export default function Customer_Details(): React.ReactElement {
  const { id } = useParams<Params>();
  const [customer, setCustomer] = useState<any>(null);
  const [loadingCustomer, setLoadingCustomer] = useState(true);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        setLoadingCustomer(true);
        const result = await fetchRecord({ url: "customers", id });
        setCustomer(result);
      } catch (error) {
        console.log("Fetch error:", error);
      } finally {
        setLoadingCustomer(false);
      }
    };
    load();
  }, [id]);

  // Lightweight existence check — decides whether the Recent Purchases
  // table renders at all, independent of the paginated table below it.
  const { data: salesExistenceResponse, loading: loadingSalesExistence } =
    useFetchDataWithStatus({ url: `sales/customer/${id}`, enabled: !!id });

  const hasPurchases: boolean = Array.isArray(salesExistenceResponse)
    ? salesExistenceResponse.length > 0
    : false;

  const { data: sessionsResponse } = useFetchDataWithStatus({
    url: `sessions/customer/${id}`,
    enabled: !!id,
  });

  const hasSessions: boolean = Array.isArray(sessionsResponse) && sessionsResponse.length > 0;

  const sessionBalance: number = hasSessions
    ? sessionsResponse.reduce(
        (total: number, session: any) => total + (session?.session_balance ?? 0),
        0
      )
    : 0;

  const isInSession: boolean = sessionBalance > 0;

  const { data: lastAttendanceResponse, loading: loadingLastAttendance } = useFetchDataWithStatus({
    url: `attendance/customer/${id}`,
    limit: 1,
    enabled: !!id,
  });

  const lastAttendance =
    Array.isArray(lastAttendanceResponse) && lastAttendanceResponse.length > 0
      ? lastAttendanceResponse[0]
      : null;

  const hasAttendance: boolean = !!lastAttendance;

  const attendanceColumns = [
    {
      header: "#",
      cell: ({ row }: any) => row.index + 1,
    },
    {
      header: "Locker Number",
      accessorKey: "locker_number",
      cell: ({ getValue }: any) => getValue() ?? "N/A",
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

  const salesColumns = [
    {
      header: "#",
      cell: ({ row }: any) => row.index + 1,
    },
    {
      header: "Item Name",
      accessorKey: "item_name",
    },
    {
      header: "Quantity",
      accessorKey: "quantity",
    },
    {
      header: "Total Price",
      accessorKey: "total_price",
      cell: ({ getValue }: any) =>
        `₱${Number(getValue()).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,
    },
    {
      header: "Date Purchased",
      accessorKey: "createdAt",
      cell: ({ getValue }: any) => formatIsoDate(getValue()),
    },
  ];

  const sessionColumns = [
    {
      header: "#",
      cell: ({ row }: any) => row.index + 1,
    },
    {
      header: "Session Balance",
      accessorKey: "session_balance",
    },
    {
      header: "Date Created",
      accessorKey: "created_at",
      cell: ({ getValue }: any) => formatIsoDate(getValue()),
    },
  ];

  if (loadingCustomer) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="background-white flex h-screen p-6 min-[1025px]:p-0 landscape:min-[1024px]:p-0 min-[1025px]:flex-row landscape:min-[1024px]:flex-row flex-col overflow-hidden">
      <div className="w-full min-[1025px]:w-64 landscape:min-[1024px]:w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 min-[1025px]:p-24 landscape:min-[1024px]:p-24 overflow-auto">
        <div className="bg-white p-16 rounded-lg flex flex-col gap-8">
          <Header
            header="Customer Details"
            subheader="A full profile view of this customer..."
          />

          <hr className="border-t border-gray-200" />

          <div className="grid grid-cols-1 min-[768px]:max-[1367px]:grid-cols-2 min-[1368px]:grid-cols-4 gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-gray-500">Name</span>
              <span className="text-lg font-semibold text-black">
                {customer?.first_name || customer?.last_name
                  ? `${customer?.first_name ?? ""} ${customer?.last_name ?? ""}`.trim()
                  : "N/A"}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-gray-500">Latest Payment Date</span>
              <span className="text-lg font-semibold text-black">
                {customer?.payment_Date ? formatIsoDate(customer.payment_Date) : "N/A"}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-gray-500">Status</span>
              <Pills status={customer?.status ?? "N/A"} />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-gray-500">Current Subscription</span>
              <span className="text-lg font-semibold text-black">
                {customer?.subscription_type ?? "N/A"}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-gray-500">In Session</span>
              <Pills status={isInSession ? "Yes" : "No"} />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-gray-500">Last Attendance</span>
              <span className="text-lg font-semibold text-black">
                {lastAttendance?.time_in ? formatTimestamp(lastAttendance.time_in) : "N/A"}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-gray-500">Sessions Left</span>
              <span className="text-lg font-semibold text-black">
                {hasSessions ? sessionBalance : "N/A"}
              </span>
            </div>
          </div>

          <hr className="border-t border-gray-200" />

          {loadingLastAttendance || hasAttendance ? (
            <TableTemplate
              header="Recent Attendance"
              subheader="This customer's most recent check-ins..."
              Url="attendance"
              Columns={attendanceColumns}
              Data={[]}
              customerId={id}
              isUserDetailsView
            />
          ) : (
            <div className="flex flex-col gap-3">
              <HeaderMd header="Recent Attendance" subheader="This customer's most recent check-ins..." />
              <EmptyState
                icon={CalendarX2}
                className="bg-gray-50 border border-gray-200 rounded-lg"
                iconClassName="bg-white text-gray-400 border border-gray-200 rounded-full"
                title="No attendance recorded"
                subtitle="This customer hasn't checked in yet."
              />
            </div>
          )}

          {!loadingSalesExistence && hasPurchases && (
            <>
              <hr className="border-t border-gray-200" />

              <TableTemplate
                header="Recent Purchases"
                subheader="Items this customer has bought from the gym store..."
                Url="sales"
                Columns={salesColumns}
                Data={[]}
                customerId={id}
                isUserDetailsView
              />
            </>
          )}

          {hasSessions && (
            <>
              <hr className="border-t border-gray-200" />

              <TableTemplate
                header="Recent Sessions"
                subheader="This customer's coaching session history..."
                Url="sessions"
                Columns={sessionColumns}
                Data={[]}
                customerId={id}
                isUserDetailsView
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
