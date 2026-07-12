import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Cards from "../../components/Cards";
import useFetchData from "../../data/fetchData";
import { subscriptionColors } from "../../charts/Line";
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
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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
      backgroundColor: c,
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
    <div className="bg-white rounded-lg p-5 flex items-center gap-4 flex-1 min-w-0">
      <div className={`p-3 rounded-xl shrink-0 ${iconBg}`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-sm text-gray-500 font-medium truncate">{title}</p>
        <p className="text-2xl font-extrabold truncate">{value}</p>
        <p className="text-xs text-gray-400 truncate">{subtitle}</p>
      </div>
    </div>
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
    <div className="bg-white rounded-lg p-6 flex flex-col w-full">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-black mb-1">{title}</h1>
        <h2 className="text-base font-light text-gray-500">{subtitle}</h2>
      </div>
      <div className="flex-1 relative min-h-0" style={{ height: "260px" }}>
        {children}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Analytics_View(): React.ReactElement {
  // -- data fetches
  const customerStats = useFetchData({ url: "customers/retrieve-stats/" });
  const subBreakdown = useFetchData({ url: "customers/monthly-breakdown" });
  const allCustomers = useFetchData({ url: "customers" });
  const allSales = useFetchData({ url: "sales" });
  const allAttendance = useFetchData({ url: "attendance" });

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

  const attendance: any[] = Array.isArray(allAttendance)
    ? allAttendance
    : Array.isArray((allAttendance as any)?.data)
    ? (allAttendance as any).data
    : [];

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
        backgroundColor: "#60a5fa",
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: "#fff",
        pointBorderWidth: 2,
      },
    ],
  };

  // ── attendance chart (group by date)
  const attendanceByDate: Record<string, number> = {};
  attendance.forEach((a) => {
    const date =
      a.time_in?.slice(0, 10) ?? a.createdAt?.slice(0, 10) ?? "Unknown";
    attendanceByDate[date] = (attendanceByDate[date] ?? 0) + 1;
  });
  const attLabels = Object.keys(attendanceByDate).sort().slice(-30); // last 30 dates
  const attLineData = {
    labels: attLabels,
    datasets: [
      {
        label: "Daily Attendance",
        data: attLabels.map((l) => attendanceByDate[l]),
        borderColor: "#34d399",
        backgroundColor: "#34d399",
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
        <StatRow cards={salesCards} />

        {/* Highlight row — Top paying customer + Top product */}
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
            value={fmt(attendance.length)}
            icon={<CalendarCheck size={20} className="text-teal-600" />}
            iconBg="bg-teal-100"
          />
        </div>

        {/* Charts row 1 — Subscription trend */}
        <div style={{ height: "350px" }}>
          <ChartPanel
            title="Monthly Subscription Trend"
            subtitle="Subscriptions broken down by type over time..."
          >
            <Line data={subChartData} options={lineOptions} />
          </ChartPanel>
        </div>

        {/* Charts row 2 — Registration & Attendance side by side */}
        <div className="flex flex-row items-stretch gap-4" style={{ height: "340px" }}>
          <div className="flex-1 min-w-0">
            <ChartPanel
              title="Customer Registrations"
              subtitle="New registrations per month..."
            >
              <Line data={regLineData} options={lineOptions} />
            </ChartPanel>
          </div>
          <div className="flex-1 min-w-0">
            <ChartPanel
              title="Attendance Trend"
              subtitle="Daily attendance for the last 30 recorded dates..."
            >
              <Line data={attLineData} options={lineOptions} />
            </ChartPanel>
          </div>
        </div>
      </div>
    </div>
  );
}
