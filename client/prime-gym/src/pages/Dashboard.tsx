import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Cards from "../components/Cards";
import useFetchData, { useFetchDataWithStatus } from "../data/fetchData";
import TableTemplate from "../templates/TableTemplate";
import DoughnutChart from "../components/charts/Doughtnut";
import SubscriptionLineChart from "../components/charts/Line";
import { Users, UserX, TrendingUp, Wallet } from "lucide-react";
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

export default function Dashboard(): React.ReactElement {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  );

  const { data: fetchDashboardData, loading: statsLoading } = useFetchDataWithStatus({
    url: "customers/retrieve-stats/",
  });

  const { data: fetchhistory, loading: historyLoading } = useFetchDataWithStatus({
    url: "customers/monthly-breakdown",
  });

  const fetchLogRecords = useFetchData({
    url: "logs",
  });

  const data = fetchDashboardData;

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

  const statCards = [
    {
      key: "activeUsers",
      header: "Active Members",
      subheader: "Members with a Paid subscription",
      figure: data?.activeUsers?.toString() ?? "0",
      icon: <Users size={20} className="text-green-600" />,
      iconBg: "bg-green-100",
    },
    {
      key: "inactiveUsers",
      header: "Expired Members",
      subheader: "Members with an Expired subscription",
      figure: data?.inactiveUsers?.toString() ?? "0",
      icon: <UserX size={20} className="text-red-500" />,
      iconBg: "bg-red-100",
    },
    {
      key: "monthlyTotalSum",
      header: "Monthly Revenue",
      subheader: "Total earnings in the last 30 days",
      figure: `₱${Number(data?.monthlyTotalSum ?? 0).toLocaleString()}`,
      icon: <TrendingUp size={20} className="text-blue-600" />,
      iconBg: "bg-blue-100",
    },
    {
      key: "totalSum",
      header: "All-Time Revenue",
      subheader: "Cumulative revenue since launch",
      figure: `₱${Number(data?.totalSum ?? 0).toLocaleString()}`,
      icon: <Wallet size={20} className="text-purple-600" />,
      iconBg: "bg-purple-100",
    },
  ];

  return (
    <div className="background-white flex h-screen p-6 min-[1025px]:p-0 landscape:min-[1024px]:p-0 min-[1025px]:flex-row landscape:min-[1024px]:flex-row flex-col overflow-hidden">
      {/* Sidebar */}
      <div className="w-full min-[1025px]:w-64 landscape:min-[1024px]:w-64">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6 p-6 min-[1025px]:p-24 landscape:min-[1024px]:p-24 overflow-auto">
        <Header
          header="Dashboard"
          subheader="Welcome back! Let's take a look how your gym is performing..."
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 landscape:min-[1024px]:max-[1400px]:!grid-cols-2 portrait:min-[1024px]:max-[1100px]:!grid-cols-2">
          {statCards.map((card) => (
            <Cards
              key={card.key}
              Card_Figure={card.figure}
              Card_Header={card.header}
              Card_Subheader={card.subheader}
              icon={card.icon}
              iconBg={card.iconBg}
              loading={statsLoading}
            />
          ))}
        </div>

        <div className="flex flex-col lg:flex-row landscape:min-[1024px]:max-[1400px]:!flex-col portrait:min-[1024px]:max-[1100px]:!flex-col items-stretch gap-4">
          <div className="flex-[2] min-w-0 overflow-x-auto h-[700px] lg:h-[600px] landscape:min-[1024px]:max-[1400px]:!h-[700px] portrait:min-[1024px]:max-[1100px]:!h-[700px]">
            <SubscriptionLineChart subMonthsData={fetchhistory || []} loading={historyLoading} />
          </div>
          <div className="flex-1 min-w-0 overflow-x-auto" style={{ height: "600px" }}>
            <DoughnutChart
              activeUsers={data?.activeUsers}
              inactiveUsers={data?.inactiveUsers}
              loading={statsLoading} />
          </div>
        </div>
        <div className="-mt-3">
          <TableTemplate
            header="Logs"
            Url="logs"
            Columns={columns}
            Data={fetchLogRecords}
            subheader="Let's manage and handle your customers..."
          />
        </div>
      </div>
    </div>
  );
}
