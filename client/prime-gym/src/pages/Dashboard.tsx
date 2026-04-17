import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Cards from "../components/Cards";
import useFetchData from "../data/fetchData";
import TableTemplate from "../templates/TableTemplate";

export default function Dashboard(): React.ReactElement {
  const [data, setData] = useState<any>(null);

  const fetchDashboardData = useFetchData({
    url: "customers/retrieve-stats/",
  });
  const fetchLogRecords = useFetchData({
    url: "logs",
  });

  useEffect(() => {
    if (fetchDashboardData) {
      setData(fetchDashboardData);
    }
  }, [fetchDashboardData]);

  console.log("Dashboard dat II", data);
  console.log(fetchLogRecords);


    const columns = [
    {
      header: "#",
      cell: ({ row }: any) => row.index + 1,
    },
    {
      header: "Logs",
      accessorKey: "logs",
    },
    {
      header: "Date Created",
      accessorKey: "createdAt",
    },
  ];
  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-64">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-24 overflow-auto">
        <Header
          header="Dashboard"
          subheader="Welcome back! Let's take a look how your gym is performing..."
        />
        <div className="flex mt-4 gap-4 flex-row">
          <Cards
            Card_Figure={data.monthlyTotalSum?.toString()}
            Card_Header="Monthly Subscription Income"
            Card_Subheader="Your total earnings this month..."
          />
          <Cards
            Card_Figure={data.monthlyTotalSum?.toString()}
            Card_Header="Monthly Subscription Income"
            Card_Subheader="Your total earnings this month..."
          />
          <Cards
            Card_Figure={data.monthlyTotalSum?.toString()}
            Card_Header="Monthly Subscription Income"
            Card_Subheader="Your total earnings this month..."
          />
          <Cards
            Card_Figure={data.monthlyTotalSum?.toString()}
            Card_Header="Monthly Subscription Income"
            Card_Subheader="Your total earnings this month..."
          />
        </div>
        <div className="mt-6">
        <TableTemplate
                  header="Table Column"
                  Columns={columns}
                  Data={fetchLogRecords}
                  subheader="Let's manage and handle your customers..."
                />
        </div>
       
      </div>
    </div>
  );
}
