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
import HeaderMd from "../HeadersMd";
import Header from "../Header";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
);

type SubscriptionItem = {
  _id: {
    year: number;
    month: number;
    subscriptionType: string;
  };
  total: number;
};

type Props = {
  subMonthsData: SubscriptionItem[] | null | undefined;
  loading?: boolean;
};

export const subscriptionColors: Record<string, string> = {
  "Daily Exercise": "#34d399",
  "Monthly Subscription": "#60a5fa",
  "Coaching Subscription": "#f97316",
  "Monthly with Coaching": "#a78bfa",
};

export default function SubscriptionLineChart({ subMonthsData, loading = false }: Props) {
  // 🔥 SAFE GUARD (prevents crashes)
  const safeData = Array.isArray(subMonthsData) ? subMonthsData : [];

  // Build labels like 2025-09, 2026-04
  const labels = [
    ...new Set(
      safeData.map(
        (item) =>
          `${item._id.year}-${String(item._id.month).padStart(2, "0")}`,
      ),
    ),
  ].sort();

  // Unique subscription types
  const subscriptionTypes = [
    ...new Set(safeData.map((item) => item._id.subscriptionType)),
  ];

  // Build datasets dynamically
  const datasets = subscriptionTypes.map((type) => {
    const color = subscriptionColors[type] || "#999";

    return {
      label: type,
      data: labels.map((label) => {
        const found = safeData.find(
          (item) =>
            `${item._id.year}-${String(item._id.month).padStart(2, "0")}` ===
            label && item._id.subscriptionType === type,
        );

        return found ? found.total : 0;
      }),

      borderColor: color,
      backgroundColor: (ctx: any) => {
        const { chart } = ctx;
        const { ctx: canvasCtx, chartArea } = chart;
        if (!chartArea) return color;

        const gradient = canvasCtx.createLinearGradient(
          0,
          chartArea.top,
          0,
          chartArea.bottom,
        );
        gradient.addColorStop(0, `${color}66`);
        gradient.addColorStop(1, `${color}00`);
        return gradient;
      },
      fill: true,
      tension: 0.5,

      pointRadius: 3,
      pointHoverRadius: 6,
      pointBackgroundColor: "#fff",
      pointBorderWidth: 2,
    };
  });

  const data = {
    labels,
    datasets,
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
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="w-full h-full rounded-2xl bg-white p-12 flex flex-col">
      <Header
        header="Monthly Subscription Trend"
        subheader="Your recent subscription activity over time..."
      />

      <div className="flex-1 mt-4 relative min-h-0" style={{ height: "340px" }}>
        {loading ? (
          <div className="w-full h-full rounded-xl bg-gray-200 animate-pulse" />
        ) : (
          <Line data={data} options={options} />
        )}
      </div>
    </div>
  );
}