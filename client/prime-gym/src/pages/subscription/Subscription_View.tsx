// @ts-ignore
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TableTemplate from "../../templates/TableTemplate";
import useFetchData from "../../data/fetchData";
import formatIsoDate from "../../utils/dateFormat";

export default function Subscription_History_View(): React.ReactElement {
  const retrieveData = useFetchData({
    url: "subscription",
  });
  const [subscriptionData, setSubsciptionHistoryData] = useState<any[]>([]);


  useEffect(() => {
    if (retrieveData) {
      setSubsciptionHistoryData(retrieveData);
      
    }
  }, [retrieveData]);
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
      header: "Amount Paid",
      accessorKey: "amount",
      cell: ({ getValue }: any) => {
        return "₱ " + getValue();
      },
    },
    { header: "Subscription Type", accessorKey: "subscription_type" },
    {
      header: "Payment Date",
      accessorKey: "dateRenewed",
      cell: ({ getValue }: any) => {
        return formatIsoDate(getValue());
      },
    },
    {
      header: "Date Created",
      accessorKey: "createdAt",
      cell: ({ getValue }: any) => {
        return formatIsoDate(getValue());
      },
    },
    {
      header: "Date Updated",
      accessorKey: "updatedAt",
      cell: ({ getValue }: any) => {
        return formatIsoDate(getValue());
      },
    },
  ];

  if (!retrieveData) {
    return <div>Loading...</div>;
  }
  console.log("Subscription:",retrieveData);
  console.log("Sub Data", subscriptionData)
  return (
    <div className="background-white flex h-screen p-6 min-[1025px]:p-0 landscape:min-[1024px]:p-0 min-[1025px]:flex-row landscape:min-[1024px]:flex-row flex-col overflow-hidden">
      <div className="w-full min-[1025px]:w-64 landscape:min-[1024px]:w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 min-[1025px]:p-24 landscape:min-[1024px]:p-24 overflow-auto">
        <TableTemplate
          header="Subscription Management"
          Columns={columns}
          Data={subscriptionData}
          Url="subscription"
          subheader="Take a look of your subscription history..."
        />
      </div>
    </div>
  );
}
