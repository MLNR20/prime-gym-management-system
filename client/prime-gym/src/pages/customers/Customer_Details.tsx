import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Pills from "../../components/Pills";
import TableTemplate from "../../templates/TableTemplate";
import fetchRecord from "../../data/fetchRecord";
import { useFetchDataWithStatus } from "../../data/fetchData";
import formatIsoDate from "../../utils/dateFormat";

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

  if (loadingCustomer) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-24 overflow-auto">
        <div className="bg-white p-16 rounded-lg flex flex-col gap-8">
          <Header
            header="Customer Details"
            subheader="A full profile view of this customer..."
          />

          <hr className="border-t border-gray-200" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-500">First Name</span>
              <span className="text-lg font-semibold text-black">
                {customer?.first_name ?? "N/A"}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-500">Last Name</span>
              <span className="text-lg font-semibold text-black">
                {customer?.last_name ?? "N/A"}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-500">Latest Payment Date</span>
              <span className="text-lg font-semibold text-black">
                {customer?.payment_Date ? formatIsoDate(customer.payment_Date) : "N/A"}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-500">Status</span>
              <Pills status={customer?.status ?? "N/A"} />
            </div>
          </div>

          <hr className="border-t border-gray-200" />

          <TableTemplate
            header="Recent Attendance"
            subheader="This customer's most recent check-ins..."
            Url="attendance"
            Columns={attendanceColumns}
            Data={[]}
            customerId={id}
            isUserDetailsView
          />

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
        </div>
      </div>
    </div>
  );
}
