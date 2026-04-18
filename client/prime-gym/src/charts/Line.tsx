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
  <div className="w-full rounded-lg bg-white p-6 h-106 flex flex-col">
    
    <div className="mb-4">
      <h1 className="text-lg font-semibold text-black mb-2">
        Subscriber Breakdown
      </h1>
      <h2 className="text-md font-light text-gray-500">
        Your recent gym span over ...
      </h2>
    </div>

    {/* chart container MUST fill remaining space */}
    <div className="flex-1 relative">
      <Line data={data} options={options} />
    </div>

  </div>
);
}
