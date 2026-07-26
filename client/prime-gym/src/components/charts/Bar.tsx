import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Header from "../Header";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

type MonthlyProfitItem = {
  month: string;   // e.g. "2025-01"
  revenue: number;
  expenses: number;
  profit: number;
};

type Props = {
  data: MonthlyProfitItem[];
  loading?: boolean;
};

export default function MonthlyProfitBarChart({ data, loading = false }: Props) {
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
        backgroundColor: "rgba(96, 165, 250, 0.85)",
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: "Expenses",
        data: safeData.map((d) => d.expenses),
        backgroundColor: "rgba(251, 113, 133, 0.85)",
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: "Net Profit",
        data: safeData.map((d) => d.profit),
        backgroundColor: "rgba(52, 211, 153, 0.9)",
        borderRadius: 8,
        borderSkipped: false,
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
    <div className="w-full h-full rounded-2xl bg-white p-12 flex flex-col">
      <Header
        header="Monthly Profit Overview"
        subheader="Revenue vs. Expenses vs. Net Profit per month"
      />
      <div className="flex-1 mt-6 relative" style={{ minHeight: "320px" }}>
        {loading ? (
          <div className="w-full h-full rounded-xl bg-gray-200 animate-pulse" />
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </div>
    </div>
  );
}
