import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { LineChart } from "lucide-react";
import Header from "../Header";
import EmptyState from "../EmptyState";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

export type MonthlyTrendItem = {
  month: string; // e.g. "2025-01"
  revenue: number;
  expenses: number;
  profit: number;
};

type Props = {
  data: MonthlyTrendItem[];
  loading?: boolean;
};

export default function MonthlyTrendLineChart({ data, loading = false }: Props) {
  const safeData = Array.isArray(data) ? data : [];

  const labels = safeData.map((d) => {
    const [year, month] = d.month.split("-");
    return new Date(Number(year), Number(month) - 1).toLocaleString("default", {
      month: "short",
      year: "2-digit",
    });
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: "Revenue",
        data: safeData.map((d) => d.revenue),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.12)",
        pointBackgroundColor: "rgb(59, 130, 246)",
        pointBorderColor: "#fff",
        pointBorderWidth: 1.5,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2.5,
        tension: 0.35,
        fill: true,
      },
      {
        label: "Expenses",
        data: safeData.map((d) => d.expenses),
        borderColor: "rgb(244, 63, 94)",
        backgroundColor: "rgba(244, 63, 94, 0.1)",
        pointBackgroundColor: "rgb(244, 63, 94)",
        pointBorderColor: "#fff",
        pointBorderWidth: 1.5,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2.5,
        tension: 0.35,
        fill: true,
      },
      {
        label: "Net Profit",
        data: safeData.map((d) => d.profit),
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "transparent",
        pointBackgroundColor: "rgb(16, 185, 129)",
        pointBorderColor: "#fff",
        pointBorderWidth: 1.5,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2,
        borderDash: [6, 4],
        tension: 0.35,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          font: { size: 12 },
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) =>
            ` ${ctx.dataset.label}: ₱${Number(ctx.raw).toLocaleString("en-PH", {
              minimumFractionDigits: 2,
            })}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: {
          callback: (value: any) => `₱${Number(value).toLocaleString()}`,
          font: { size: 11 },
        },
      },
    },
  };

  return (
    <div className="w-full h-full min-w-0 rounded-2xl bg-white p-12 flex flex-col overflow-hidden">
      <Header
        header="Monthly Trend"
        subheader="Revenue vs. Expenses vs. Net Profit over time"
      />
      <div className="flex-1 min-h-0 min-w-0 mt-6 relative">
        {loading ? (
          <div className="w-full h-full rounded-xl bg-gray-200 animate-pulse" />
        ) : safeData.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <EmptyState icon={LineChart} title="Nothing to see here" subtitle="No financial history yet." />
          </div>
        ) : (
          <Line data={chartData} options={options} />
        )}
      </div>
    </div>
  );
}
