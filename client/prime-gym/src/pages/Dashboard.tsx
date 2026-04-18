import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Cards from "../components/Cards";
import useFetchData from "../data/fetchData";
import TableTemplate from "../templates/TableTemplate";
import DoughnutChart from "../charts/Doughtnut";
import SubscriptionLineChart from "../charts/Line";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

export default function Dashboard(): React.ReactElement {
  const [data, setData] = useState<any>(null);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  );


  const fetchDashboardData = useFetchData({
    url: "customers/retrieve-stats/",
  });

    const fetchhistory = useFetchData({
    url: "customers/monthly-breakdown",
  }) || [];


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

  
if (!data || !fetchhistory?.subMonthsData) {
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
            Card_Figure={data?.monthlyTotalSum?.toString() || "0"}
            Card_Header="Monthly Subscription Income"
            Card_Subheader="Your total earnings this month..."
          />
          <Cards
            Card_Figure={data?.monthlyTotalSum?.toString() || "0"}
            Card_Header="Monthly Subscription Income"
            Card_Subheader="Your total earnings this month..."
          />
          <Cards
            Card_Figure={data?.monthlyTotalSum?.toString() || "0"}
            Card_Header="Monthly Subscription Income"
            Card_Subheader="Your total earnings this month..."
          />
          <Cards
            Card_Figure={data?.monthlyTotalSum?.toString() || "0"}
            Card_Header="Monthly Subscription Income"
            Card_Subheader="Your total earnings this month..."
          />
        </div>
   
        <div className="flex flex-row my-4 w-full gap-4">
          <SubscriptionLineChart subMonthsData={fetchhistory?.subMonthsData || []}/>
          <DoughnutChart 
            activeUsers={data.activeUsers}
            inactiveUsers={data.inactiveUsers}/>
        </div>
        <div>
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
