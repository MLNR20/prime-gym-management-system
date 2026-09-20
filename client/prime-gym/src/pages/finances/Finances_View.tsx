import React, { useState, useMemo } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Cards from "../../components/Cards";
import { useFetchDataWithStatus } from "../../data/fetchData";
import FinanceColumnChart from "../../components/charts/Bar";
import type { FinanceChartItem, FinanceRangeFilter } from "../../components/charts/Bar";
import MonthlyTrendLineChart from "../../components/charts/FinanceTrendLine";
import type { MonthlyTrendItem } from "../../components/charts/FinanceTrendLine";
import { TableRowsSkeleton } from "../../components/Skeleton";
import EmptyState from "../../components/EmptyState";
import { TrendingUp, TrendingDown, DollarSign, Activity, Trophy, Users } from "lucide-react";

// ─── helpers ─────────────────────────────────────────────────────────────────

// Large enough to pull the full dataset instead of the server's default
// page size of 10 — every total on this page depends on seeing every record.
const FULL_DATASET_LIMIT = 10000;

function toMonthKey(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function formatPeso(n: number) {
  return `₱${Number(n).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
}

// ─── component ───────────────────────────────────────────────────────────────

export default function Finances_View(): React.ReactElement {
  const { data: rawSales, loading: salesLoading } = useFetchDataWithStatus({ url: "sales/show/", limit: FULL_DATASET_LIMIT });
  const { data: rawExpenses, loading: expensesLoading } = useFetchDataWithStatus({ url: "expenses/show/", limit: FULL_DATASET_LIMIT });
  const { data: rawSubscriptions, loading: subscriptionsLoading } = useFetchDataWithStatus({ url: "subscription/show/", limit: FULL_DATASET_LIMIT });
  const isLoading = salesLoading || expensesLoading || subscriptionsLoading;

  // chart date-range filter — defaults to "this month"
  const [rangeFilter, setRangeFilter] = useState<FinanceRangeFilter>("month");

  // ── derive totals ──────────────────────────────────────────────────────────
  const salesArr: any[] = Array.isArray(rawSales?.data)
    ? rawSales.data
    : Array.isArray(rawSales)
    ? rawSales
    : [];

  const expensesArr: any[] = Array.isArray(rawExpenses?.data)
    ? rawExpenses.data
    : Array.isArray(rawExpenses)
    ? rawExpenses
    : [];

  const subscriptionsArr: any[] = Array.isArray(rawSubscriptions?.data)
    ? rawSubscriptions.data
    : Array.isArray(rawSubscriptions)
    ? rawSubscriptions
    : [];

  const totalRevenue =
    salesArr.reduce((sum: number, s: any) => sum + Number(s.total_price ?? 0), 0) +
    subscriptionsArr.reduce((sum: number, s: any) => sum + Number(s.amount ?? 0), 0);
  const totalExpenses = expensesArr.reduce(
    (sum: number, e: any) => sum + Number(e.unit_price ?? 0) * Number(e.quantity ?? 1),
    0
  );
  const netProfit = totalRevenue - totalExpenses;

  // ── date-filtered aggregation for the column chart ─────────────────────────
  // Buckets every sale, subscription payment, and expense by its createdAt
  // date into the range selected by the user (week / month / year).
  const chartData: FinanceChartItem[] = useMemo(() => {
    const now = new Date();

    const addAmount = (
      map: Map<string | number, { revenue: number; expenses: number }>,
      bucketKey: string | number | null,
      field: "revenue" | "expenses",
      amount: number
    ) => {
      if (bucketKey === null) return;
      const bucket = map.get(bucketKey);
      if (bucket) bucket[field] += amount;
    };

    if (rangeFilter === "week") {
      // start of the current week (Sunday) through Saturday
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      start.setDate(start.getDate() - start.getDay());
      const end = new Date(start);
      end.setDate(start.getDate() + 7);

      const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return d;
      });

      const map = new Map(days.map((d) => [d.toDateString(), { revenue: 0, expenses: 0 }]));

      const bucketFor = (iso: string) => {
        const d = new Date(iso);
        return d >= start && d < end ? d.toDateString() : null;
      };

      salesArr.forEach((s: any) => addAmount(map, bucketFor(s.createdAt), "revenue", Number(s.total_price ?? 0)));
      subscriptionsArr.forEach((s: any) => addAmount(map, bucketFor(s.createdAt), "revenue", Number(s.amount ?? 0)));
      expensesArr.forEach((e: any) =>
        addAmount(map, bucketFor(e.createdAt), "expenses", Number(e.unit_price ?? 0) * Number(e.quantity ?? 1))
      );

      return days.map((d) => {
        const v = map.get(d.toDateString())!;
        return { label: d.toLocaleDateString("default", { weekday: "short" }), revenue: v.revenue, expenses: v.expenses };
      });
    }

    if (rangeFilter === "year") {
      const year = now.getFullYear();
      const months = Array.from({ length: 12 }, (_, i) => i);
      const map = new Map(months.map((m) => [m, { revenue: 0, expenses: 0 }]));

      const bucketFor = (iso: string) => {
        const d = new Date(iso);
        return d.getFullYear() === year ? d.getMonth() : null;
      };

      salesArr.forEach((s: any) => addAmount(map, bucketFor(s.createdAt), "revenue", Number(s.total_price ?? 0)));
      subscriptionsArr.forEach((s: any) => addAmount(map, bucketFor(s.createdAt), "revenue", Number(s.amount ?? 0)));
      expensesArr.forEach((e: any) =>
        addAmount(map, bucketFor(e.createdAt), "expenses", Number(e.unit_price ?? 0) * Number(e.quantity ?? 1))
      );

      return months.map((m) => {
        const v = map.get(m)!;
        const label = new Date(year, m).toLocaleDateString("default", { month: "short" });
        return { label, revenue: v.revenue, expenses: v.expenses };
      });
    }

    // "month" — default: every day of the current calendar month
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const map = new Map(days.map((d) => [d, { revenue: 0, expenses: 0 }]));

    const bucketFor = (iso: string) => {
      const d = new Date(iso);
      return d.getFullYear() === year && d.getMonth() === month ? d.getDate() : null;
    };

    salesArr.forEach((s: any) => addAmount(map, bucketFor(s.createdAt), "revenue", Number(s.total_price ?? 0)));
    subscriptionsArr.forEach((s: any) => addAmount(map, bucketFor(s.createdAt), "revenue", Number(s.amount ?? 0)));
    expensesArr.forEach((e: any) =>
      addAmount(map, bucketFor(e.createdAt), "expenses", Number(e.unit_price ?? 0) * Number(e.quantity ?? 1))
    );

    return days.map((d) => ({ label: `${d}`, revenue: map.get(d)!.revenue, expenses: map.get(d)!.expenses }));
  }, [rangeFilter, salesArr, subscriptionsArr, expensesArr]);

  // ── full-history monthly trend for the line chart ───────────────────────────
  const monthlyTrendData: MonthlyTrendItem[] = useMemo(() => {
    const map: Record<string, { revenue: number; expenses: number }> = {};

    salesArr.forEach((s: any) => {
      const key = toMonthKey(s.createdAt ?? new Date().toISOString());
      if (!map[key]) map[key] = { revenue: 0, expenses: 0 };
      map[key].revenue += Number(s.total_price ?? 0);
    });

    subscriptionsArr.forEach((s: any) => {
      const key = toMonthKey(s.createdAt ?? new Date().toISOString());
      if (!map[key]) map[key] = { revenue: 0, expenses: 0 };
      map[key].revenue += Number(s.amount ?? 0);
    });

    expensesArr.forEach((e: any) => {
      const key = toMonthKey(e.createdAt ?? new Date().toISOString());
      if (!map[key]) map[key] = { revenue: 0, expenses: 0 };
      map[key].expenses += Number(e.unit_price ?? 0) * Number(e.quantity ?? 1);
    });

    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, v]) => ({
        month,
        revenue: v.revenue,
        expenses: v.expenses,
        profit: v.revenue - v.expenses,
      }));
  }, [salesArr, subscriptionsArr, expensesArr]);

  // ── highest paying customers ────────────────────────────────────────────────
  // Aggregates every sale and subscription payment by customer_id.
  const topCustomers = useMemo(() => {
    const map = new Map<
      string,
      { name: string; totalSpent: number; orders: number }
    >();

    const addSpend = (customerId: string | undefined, name: string, amount: number) => {
      if (!customerId) return;
      const existing = map.get(customerId);
      if (existing) {
        existing.totalSpent += amount;
        existing.orders += 1;
        if (existing.name === "N/A" && name !== "N/A") existing.name = name;
      } else {
        map.set(customerId, { name, totalSpent: amount, orders: 1 });
      }
    };

    salesArr.forEach((s: any) => {
      const name = `${s.first_name ?? "N/A"} ${s.last_name ?? ""}`.trim();
      addSpend(s.customer_id, name || "N/A", Number(s.total_price ?? 0));
    });

    subscriptionsArr.forEach((s: any) => {
      const name = `${s.first_name ?? "N/A"} ${s.last_name ?? ""}`.trim();
      addSpend(s.customer_id, name || "N/A", Number(s.amount ?? 0));
    });

    return Array.from(map.values())
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10);
  }, [salesArr, subscriptionsArr]);

  // ── stat cards ─────────────────────────────────────────────────────────────
  const statCards = [
    {
      key: "revenue",
      Card_Header: "Total Revenue",
      Card_Subheader: "Gross earnings from sales and subscriptions",
      Card_Figure: formatPeso(totalRevenue),
      icon: <TrendingUp size={20} className="text-blue-600" />,
      iconBg: "bg-blue-100",
    },
    {
      key: "expenses",
      Card_Header: "Total Expenses",
      Card_Subheader: "Cumulative operating expenses",
      Card_Figure: formatPeso(totalExpenses),
      icon: <TrendingDown size={20} className="text-rose-500" />,
      iconBg: "bg-rose-100",
    },
    {
      key: "profit",
      Card_Header: "Net Profit",
      Card_Subheader: "Revenue minus expenses",
      Card_Figure: formatPeso(netProfit),
      icon: <DollarSign size={20} className={netProfit >= 0 ? "text-emerald-600" : "text-red-500"} />,
      iconBg: netProfit >= 0 ? "bg-emerald-100" : "bg-red-100",
    },
    {
      key: "margin",
      Card_Header: "Profit Margin",
      Card_Subheader: "Net profit as a share of revenue",
      Card_Figure: totalRevenue > 0 ? `${((netProfit / totalRevenue) * 100).toFixed(1)}%` : "—",
      icon: <Activity size={20} className="text-violet-600" />,
      iconBg: "bg-violet-100",
    },
  ];

  return (
    <div className="background-white flex h-screen p-6 min-[1025px]:p-0 landscape:min-[1024px]:p-0 min-[1025px]:flex-row landscape:min-[1024px]:flex-row flex-col overflow-hidden">
      {/* Sidebar */}
      <div className="w-full min-[1025px]:w-64 landscape:min-[1024px]:w-64">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 space-y-6 p-6 min-[1025px]:p-24 landscape:min-[1024px]:p-24 overflow-auto">
        <Header
          header="Finances"
          subheader="An overview of your gym's financial health — revenue, expenses, and net profit."
        />

        {/* ── Stat Cards ── */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((c) => (
            <Cards
              key={c.key}
              Card_Header={c.Card_Header}
              Card_Subheader={c.Card_Subheader}
              Card_Figure={c.Card_Figure}
              icon={c.icon}
              iconBg={c.iconBg}
              loading={isLoading}
            />
          ))}
        </div>

        {/* ── Monthly Trend Line Chart ── */}
        <div className="w-full min-w-0 h-[440px] sm:h-[540px] lg:h-[640px]">
          <MonthlyTrendLineChart data={monthlyTrendData} loading={isLoading} />
        </div>

        {/* ── Revenue vs. Expenses Chart ── */}
        <div className="w-full min-w-0 h-[540px] sm:h-[620px] lg:h-[720px]">
          <FinanceColumnChart data={chartData} filter={rangeFilter} onFilterChange={setRangeFilter} loading={isLoading} />
        </div>

        {/* ── Highest Paying Customers ── */}
        <div className="bg-white rounded-2xl p-12 sm:p-16 lg:p-16 flex flex-col w-full overflow-hidden">
          <Header
            header="Highest Paying Customers"
            subheader="Top 10 customers ranked by combined sales and subscription spend."
          />

          <div className="mt-6 overflow-x-auto">
            <table className="table table-zebra">
              <thead className="bg-slate-300 text-md">
                <tr className="bg-slate-300">
                  <th className="text-black font-bold text-[0.950rem] p-5 bg-gray-100">#</th>
                  <th className="text-black font-bold text-[0.950rem] p-5 bg-gray-100">Customer</th>
                  <th className="text-black font-bold text-[0.950rem] p-5 bg-gray-100">Orders</th>
                  <th className="text-black font-bold text-[0.950rem] p-5 bg-gray-100">Total Spent</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <TableRowsSkeleton rows={5} columns={4} />
                ) : topCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="border-b border-gray-300">
                      <EmptyState
                        icon={Users}
                        title="Nothing to see here"
                        subtitle="No customer purchases recorded yet."
                      />
                    </td>
                  </tr>
                ) : (
                  topCustomers.map((c, i) => (
                    <tr key={`${c.name}-${i}`} className="odd:bg-white even:bg-gray-100 border-2 border-indigo-200 border-b-gray-300">
                      <td className="border-b p-5 text-[0.950rem] border-gray-300">
                        {i < 3 ? (
                          <span className="inline-flex items-center gap-1.5 font-semibold text-amber-600">
                            <Trophy size={16} />#{i + 1}
                          </span>
                        ) : (
                          `#${i + 1}`
                        )}
                      </td>
                      <td className="border-b p-5 text-[0.950rem] border-gray-300">{c.name}</td>
                      <td className="border-b p-5 text-[0.950rem] border-gray-300">{c.orders}</td>
                      <td className="border-b p-5 text-[0.950rem] border-gray-300 font-semibold text-emerald-600">
                        {formatPeso(c.totalSpent)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
