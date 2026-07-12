import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";
import HeaderMd from "../components/HeadersMd";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
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
};

export const subscriptionColors: Record<string, string> = {
  "Daily Exercise": "#34d399",
  "Monthly Subscription": "#60a5fa",
  "Coaching Subscription": "#f97316",
  "Monthly with Coaching": "#a78bfa",
};

export default function SubscriptionLineChart({ subMonthsData }: Props) {
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
  const datasets = subscriptionTypes.map((type) => ({
    label: type,
    data: labels.map((label) => {
      const found = safeData.find(
        (item) =>
          `${item._id.year}-${String(item._id.month).padStart(2, "0")}` ===
            label && item._id.subscriptionType === type,
      );

      return found ? found.total : 0;
    }),

    borderColor: subscriptionColors[type] || "#999",
    backgroundColor: subscriptionColors[type] || "#999",
    tension: 0.5,

    pointRadius: 3,
    pointHoverRadius: 6,
    pointBackgroundColor: "#fff",
    pointBorderWidth: 2,
  }));

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
    <div className="w-full h-full rounded-2xl bg-white p-8 flex flex-col shadow-sm">
      <HeaderMd
        header="Monthly Subscription Trend"
        subheader="Your recent subscription activity over time..."
      />

      <div className="flex-1 relative min-h-0" style={{ height: "340px" }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}