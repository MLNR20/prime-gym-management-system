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
  subMonthsData: SubscriptionItem[];
};

export const subscriptionColors: Record<string, string> = {
  "Daily Exercise": "#34d399", // green
  "Monthly Subscription": "#60a5fa", // blue
  "Coaching Subscription": "#f97316", // orange
  "Monthly with Coaching": "#a78bfa", // purple
};

export default function SubscriptionLineChart({ subMonthsData }: Props) {
  // Build labels like 2025-09, 2026-04
  const labels = [
    ...new Set(
      subMonthsData.map(
        (item) => `${item._id.year}-${String(item._id.month).padStart(2, "0")}`,
      ),
    ),
  ].sort();

  // Unique subscription types
  const subscriptionTypes = [
    ...new Set(subMonthsData.map((item) => item._id.subscriptionType)),
  ];

  // Build datasets dynamically
  const datasets = subscriptionTypes.map((type) => ({
    label: type,
    data: labels.map((label) => {
      const found = subMonthsData.find(
        (item) =>
          `${item._id.year}-${String(item._id.month).padStart(2, "0")}` ===
            label && item._id.subscriptionType === type,
      );

      return found ? found.total : 0;
    }),

    borderColor: subscriptionColors[type] || "#999",
    backgroundColor: subscriptionColors[type] || "#999",
    tension: 0.5,
  // ✨ smoother points (less noise)
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
    <div className="w-full rounded-lg max-h-96 p-6 bg-white">
      <Line data={data} options={options} />
    </div>
  );
}
