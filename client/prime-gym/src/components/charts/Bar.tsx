import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { BarChart3 } from "lucide-react";
import EmptyState from "../EmptyState";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export type FinanceRangeFilter = "week" | "month" | "year";

export type FinanceChartItem = {
  label: string;
  revenue: number;
  expenses: number;
};

type Props = {
  data: FinanceChartItem[];
  filter: FinanceRangeFilter;
  onFilterChange: (filter: FinanceRangeFilter) => void;
  loading?: boolean;
};

const FILTERS: { key: FinanceRangeFilter; label: string }[] = [
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
  { key: "year", label: "This Year" },
];

export default function FinanceColumnChart({ data, filter, onFilterChange, loading = false }: Props) {
  const safeData = Array.isArray(data) ? data : [];

  const chartData = {
    labels: safeData.map((d) => d.label),
    datasets: [
      {
        label: "Revenue",
        data: safeData.map((d) => d.revenue),
        backgroundColor: "rgba(59, 130, 246, 0.85)",
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 42,
      },
      {
        label: "Expenses",
        data: safeData.map((d) => d.expenses),
        backgroundColor: "rgba(244, 63, 94, 0.85)",
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 42,
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
        ticks: { font: { size: 11 }, maxRotation: 45, minRotation: 0, autoSkip: true },
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
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="text-xl sm:text-2xl font-bold black">Revenue vs. Expenses</div>
          <select
            aria-label="Date range filter"
            value={filter}
            onChange={(e) => onFilterChange(e.target.value as FinanceRangeFilter)}
            className="sm:hidden shrink-0 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {FILTERS.map((f) => (
              <option key={f.key} value={f.key}>
                {f.label}
              </option>
            ))}
          </select>

          <div
            role="tablist"
            aria-label="Date range filter"
            className="hidden sm:flex shrink-0 gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1"
          >
            {FILTERS.map((f) => {
              const isActive = filter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onFilterChange(f.key)}
                  className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="text-base sm:text-lg lg:text-xl font-regular text-gray-500">
          Column breakdown filtered by date created
        </div>
      </div>

      <div className="flex-1 min-h-0 min-w-0 mt-6 relative">
        {loading ? (
          <div className="w-full h-full rounded-xl bg-gray-200 animate-pulse" />
        ) : safeData.every((d) => d.revenue === 0 && d.expenses === 0) ? (
          <div className="w-full h-full flex items-center justify-center">
            <EmptyState
              icon={BarChart3}
              title="Nothing to see here"
              subtitle="No revenue or expenses recorded for this period."
            />
          </div>
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </div>
    </div>
  );
}
