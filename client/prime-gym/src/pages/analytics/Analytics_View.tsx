import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Cards from "../../components/Cards";
import Pills from "../../components/Pills";
import TableTemplate from "../../templates/TableTemplate";
import { useFetchDataWithStatus } from "../../data/fetchData";
import Skeleton from "../../components/Skeleton";
import formatIsoDate from "../../utils/dateFormat";
import { subscriptionColors } from "../../components/charts/Line";
import {
  ShoppingCart,
  TrendingUp,
  UserRound,
  CalendarCheck,
  Package2,
  Crown,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// ── gradient fill helper ─────────────────────────────────────────────────────
function makeGradient(color: string) {
  return (context: any) => {
    const { chart } = context;
    const { ctx, chartArea } = chart;
    if (!chartArea) return "transparent";
    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    gradient.addColorStop(0, `${color}66`);
    gradient.addColorStop(1, `${color}00`);
    return gradient;
  };
}

// ── helpers ──────────────────────────────────────────────────────────────────
function fmt(n: number | null | undefined) {
  return n != null && !isNaN(n) ? n.toLocaleString() : "0";
}
function fmtPeso(n: number | null | undefined) {
  return `₱${fmt(n)}`;
}
function fmtStr(s: string | null | undefined) {
  return s && s.trim() !== "" ? s : "N/A";
}

// ── line chart factory ───────────────────────────────────────────────────────
function buildLineData(
  rawData: any[],
  labelKey: (item: any) => string,
  seriesKey: (item: any) => string,
  valueKey: (item: any) => number,
  colorMap?: Record<string, string>,
  defaultColor = "#60a5fa"
) {
  const labels = [...new Set(rawData.map(labelKey))].sort();
  const seriesNames = [...new Set(rawData.map(seriesKey))];

  const datasets = seriesNames.map((name, i) => {
    const color = colorMap?.[name] ?? defaultColor;
    const palette = ["#34d399", "#60a5fa", "#f97316", "#a78bfa", "#fb7185"];
    const c = colorMap?.[name] ?? palette[i % palette.length];
    return {
      label: name,
      data: labels.map((lbl) => {
        const found = rawData.find(
          (d) => labelKey(d) === lbl && seriesKey(d) === name
        );
        return found ? valueKey(found) : 0;
      }),
      borderColor: c,
      backgroundColor: makeGradient(c),
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 6,
      pointBackgroundColor: "#fff",
      pointBorderWidth: 2,
    };
  });

  return { labels, datasets };
}

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: "index" as const, intersect: false },
  plugins: { legend: { position: "top" as const } },
  scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
};

// ── stat card row ─────────────────────────────────────────────────────────────
function StatRow({ cards }: { cards: React.ComponentProps<typeof Cards>[] }) {
  return (
    <div className="flex gap-4 flex-col lg:flex-row">
      {cards.map((c, i) => (
        <Cards key={i} {...c} />
      ))}
    </div>
  );
}

// ── highlight card (top-X) ────────────────────────────────────────────────────
function HighlightCard({
  title,
  subtitle,
  value,
  icon,
  iconBg,
}: {
  title: string;
  subtitle: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
}) {
  return (
    <Cards
      Card_Header={title}
      Card_Figure={value}
      Card_Subheader={subtitle}
      icon={icon}
      iconBg={iconBg}
    />
  );
}

// ── Chart panel wrapper ───────────────────────────────────────────────────────
function ChartPanel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl p-12 flex flex-col w-full h-full">
      <Header header={title} subheader={subtitle} />
      <div className="flex-1 mt-4 relative min-h-0" style={{ height: "260px" }}>
        {children}
      </div>
    </div>
  );
}

// ── skeleton placeholders ────────────────────────────────────────────────────
function CardSkeleton() {
  return (
    <div className="card mt-2 p-1 bg-white w-full gap-y-4">
      <div className="card-body flex-row items-start gap-4">
        <Skeleton className="h-11 w-11 rounded-xl shrink-0" />
        <div className="flex flex-col gap-y-2 w-full">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-7 w-1/2" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
    </div>
  );
}

function ChartPanelSkeleton({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="bg-white rounded-2xl p-12 flex flex-col w-full h-full">
      <Header header={title} subheader={subtitle} />
      <div className="flex-1 mt-4 relative min-h-0" style={{ height: "260px" }}>
        <Skeleton className="w-full h-full" />
      </div>
    </div>
  );
}

function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-2xl p-12 flex flex-col w-full gap-4">
      <Header
        header="Recent Registrations"
        subheader="View a customer's full details..."
      />
      <div className="flex flex-col gap-3 mt-2">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Analytics_View(): React.ReactElement {
  const navigate = useNavigate();
  // -- data fetches
  const { data: customerStats, loading: loadingCustomerStats } =
    useFetchDataWithStatus({ url: "customers/retrieve-stats/" });
  const { data: subBreakdown, loading: loadingSubBreakdown } =
    useFetchDataWithStatus({ url: "customers/monthly-breakdown" });
  const { data: allCustomers, loading: loadingCustomers } =
    useFetchDataWithStatus({ url: "customers" });
  const { data: allSales, loading: loadingSales } = useFetchDataWithStatus({
    url: "sales",
  });
  const { data: attendanceBreakdown, loading: loadingAttendance } =
    useFetchDataWithStatus({ url: "attendance/analytics/daily-breakdown" });

  const isLoading =
    loadingCustomerStats ||
    loadingSubBreakdown ||
    loadingCustomers ||
    loadingSales ||
    loadingAttendance;

  // -- derived
  const customers: any[] = Array.isArray(allCustomers)
    ? allCustomers
    : Array.isArray((allCustomers as any)?.data)
    ? (allCustomers as any).data
    : [];

  const sales: any[] = Array.isArray(allSales)
    ? allSales
    : Array.isArray((allSales as any)?.data)
    ? (allSales as any).data
    : [];

  const dailyAttendanceCounts: { date: string; count: number }[] = Array.isArray(
    (attendanceBreakdown as any)?.dailyCounts
  )
    ? (attendanceBreakdown as any).dailyCounts
    : [];
  const totalAttendanceCount: number = (attendanceBreakdown as any)?.total ?? 0;

  const subData: any[] = Array.isArray(subBreakdown) ? subBreakdown : [];

  // ── sales KPIs
  const totalSalesRevenue = sales.reduce(
    (acc, s) => acc + (s.total_price ?? 0),
    0
  );
  const totalUnitsSold = sales.reduce((acc, s) => acc + (s.quantity ?? 0), 0);
  const totalTransactions = sales.length;

  // ── top paying customer (by amount_paid)
  const topPayingCustomer =
    customers.length > 0
      ? customers.reduce((best, c) =>
          (c.amount_paid ?? 0) > (best.amount_paid ?? 0) ? c : best
        )
      : null;

  // ── top selling product (by quantity sold)
  const productMap: Record<string, number> = {};
  sales.forEach((s) => {
    const name = s.item_name ?? "Unknown";
    productMap[name] = (productMap[name] ?? 0) + (s.quantity ?? 0);
  });
  const topProductEntry =
    Object.entries(productMap).sort((a, b) => b[1] - a[1])[0] ?? null;

  // ── customer registration chart  (group by month from createdAt)
  const registrationData = customers
    .filter((c) => c.createdAt)
    .map((c) => ({
      month: c.createdAt.slice(0, 7),
    }));

  const regCountByMonth: Record<string, number> = {};
  registrationData.forEach(({ month }) => {
    regCountByMonth[month] = (regCountByMonth[month] ?? 0) + 1;
  });
  const regLabels = Object.keys(regCountByMonth).sort();
  const regLineData = {
    labels: regLabels,
    datasets: [
      {
        label: "New Registrations",
        data: regLabels.map((l) => regCountByMonth[l]),
        borderColor: "#60a5fa",
        backgroundColor: makeGradient("#60a5fa"),
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: "#fff",
        pointBorderWidth: 2,
      },
    ],
  };

  // ── attendance chart (already grouped by date server-side)
  const attLabels = dailyAttendanceCounts.map((d) => d.date);
  const attLineData = {
    labels: attLabels,
    datasets: [
      {
        label: "Daily Attendance",
        data: dailyAttendanceCounts.map((d) => d.count),
        borderColor: "#34d399",
        backgroundColor: makeGradient("#34d399"),
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: "#fff",
        pointBorderWidth: 2,
      },
    ],
  };

  // ── subscription breakdown chart (reuse existing data)
  const subChartData = buildLineData(
    subData,
    (item) =>
      `${item._id.year}-${String(item._id.month).padStart(2, "0")}`,
    (item) => item._id.subscriptionType,
    (item) => item.total,
    subscriptionColors
  );

  // ── stat cards
  const salesCards = [
    {
      Card_Header: "Total Sales Revenue",
      Card_Figure: fmtPeso(totalSalesRevenue),
      Card_Subheader: "All-time gross from sales",
      icon: <TrendingUp size={20} className="text-green-600" />,
      iconBg: "bg-green-100",
    },
    {
      Card_Header: "Units Sold",
      Card_Figure: fmt(totalUnitsSold),
      Card_Subheader: "Total product units sold",
      icon: <Package2 size={20} className="text-blue-600" />,
      iconBg: "bg-blue-100",
    },
    {
      Card_Header: "Transactions",
      Card_Figure: fmt(totalTransactions),
      Card_Subheader: "Total recorded sale transactions",
      icon: <ShoppingCart size={20} className="text-orange-500" />,
      iconBg: "bg-orange-100",
    },
    {
      Card_Header: "Total Members",
      Card_Figure: fmt(customers.length),
      Card_Subheader: "All registered customers",
      icon: <UserRound size={20} className="text-purple-600" />,
      iconBg: "bg-purple-100",
    },
  ];

  // ── recent customer registrations table (most recent first)
  const recentRegistrations = [...customers]
    .filter((c) => c.createdAt)
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 10);

  const registrationColumns = [
    {
      header: "#",
      cell: ({ row }: any) => row.index + 1,
    },
    {
      header: "Full Name",
      accessorFn: (row: any) => `${fmtStr(row.first_name)} ${fmtStr(row.last_name)}`,
    },
    {
      header: "Subscription Type",
      accessorKey: "subscription_type",
      cell: ({ getValue }: any) => fmtStr(getValue()),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }: any) => <Pills status={getValue()} />,
    },
    {
      header: "Date Registered",
      accessorKey: "createdAt",
      cell: ({ getValue }: any) => formatIsoDate(getValue()),
    },
    {
      header: "",
      id: "view_details",
      cell: ({ row }: any) => (
        <button
          className="btn btn-sm btn-info text-white"
          onClick={() => navigate(`/customers/${row.original._id}/details`)}
        >
          View Details
        </button>
      ),
    },
  ];

  return (
    <div className="flex h-screen p-6 md:p-0 lg:p-0 lg:flex-row md:flex-row flex-col overflow-hidden">
      {/* Sidebar */}
      <div className="w-full md:w-48 lg:w-64">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 space-y-6 p-6 md:p-24 lg:p-24 overflow-auto">
        <Header
          header="Analytics"
          subheader="A detailed view of your gym's performance..."
        />

        {/* KPI Cards */}
        {isLoading ? (
          <div className="flex gap-4 flex-col lg:flex-row">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <StatRow cards={salesCards} />
        )}

        {/* Highlight row — Top paying customer + Top product */}
        {isLoading ? (
          <div className="flex gap-4 flex-col lg:flex-row">
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="flex gap-4 flex-col lg:flex-row">
            <HighlightCard
              title="Top Paying Customer"
              subtitle="Highest amount paid"
              value={
                topPayingCustomer
                  ? `${fmtStr(topPayingCustomer.first_name)} ${fmtStr(topPayingCustomer.last_name)}`
                  : "N/A"
              }
              icon={<Crown size={20} className="text-yellow-600" />}
              iconBg="bg-yellow-100"
            />
            <HighlightCard
              title="Top Selling Product"
              subtitle="Most units sold"
              value={topProductEntry ? fmtStr(topProductEntry[0]) : "N/A"}
              icon={<Package2 size={20} className="text-indigo-600" />}
              iconBg="bg-indigo-100"
            />
            <HighlightCard
              title="Total Attendance Records"
              subtitle="All check-ins logged"
              value={fmt(totalAttendanceCount)}
              icon={<CalendarCheck size={20} className="text-teal-600" />}
              iconBg="bg-teal-100"
            />
          </div>
        )}

        {/* Charts row 1 — Subscription trend */}
        <div style={{ height: "450px" }}>
          {isLoading ? (
            <ChartPanelSkeleton
              title="Monthly Subscription Trend"
              subtitle="Subscriptions broken down by type over time..."
            />
          ) : (
            <ChartPanel
              title="Monthly Subscription Trend"
              subtitle="Subscriptions broken down by type over time..."
            >
              <Line data={subChartData} options={lineOptions} />
            </ChartPanel>
          )}
        </div>

        {/* Charts row 2 — Registration & Attendance side by side */}
        <div className="flex flex-row items-stretch gap-4" style={{ height: "450px" }}>
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <ChartPanelSkeleton
                title="Customer Registrations"
                subtitle="New registrations per month..."
              />
            ) : (
              <ChartPanel
                title="Customer Registrations"
                subtitle="New registrations per month..."
              >
                <Line data={regLineData} options={lineOptions} />
              </ChartPanel>
            )}
          </div>
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <ChartPanelSkeleton
                title="Attendance Trend"
                subtitle="Daily attendance for the last 30 recorded dates..."
              />
            ) : (
              <ChartPanel
                title="Attendance Trend"
                subtitle="Daily attendance for the last 30 recorded dates..."
              >
                <Line data={attLineData} options={lineOptions} />
              </ChartPanel>
            )}
          </div>
        </div>

        {/* Logs row — Recent registrations */}
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <TableTemplate
            header="Recent Registrations"
            subheader="View a customer's full details..."
            Url="customers"
            Columns={registrationColumns}
            Data={recentRegistrations}
          />
        )}
      </div>
    </div>
  );
}
