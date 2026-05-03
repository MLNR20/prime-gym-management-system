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
    <div className="flex background-white h-screen overflow-hidden">
      <div className="w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-24 overflow-auto">
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
