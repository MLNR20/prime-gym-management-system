import React, { useState, useMemo } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Cards from "../../components/Cards";
import useFetchData from "../../data/fetchData";
import MonthlyProfitBarChart from "../../components/charts/Bar";
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";

// ─── helpers ─────────────────────────────────────────────────────────────────

function toMonthKey(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function formatPeso(n: number) {
  return `₱${Number(n).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
}

// ─── component ───────────────────────────────────────────────────────────────

export default function Finances_View(): React.ReactElement {
  const rawSales = useFetchData({ url: "sales/show/" });
  const rawExpenses = useFetchData({ url: "expenses/show/" });
  const rawSubscriptions = useFetchData({ url: "subscription" });

  // slider: 0–100 maps from "all expenses" ➜ "all revenue"
  const [sliderValue, setSliderValue] = useState(50);

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

  // ── monthly aggregation for bar chart ─────────────────────────────────────
  const monthlyData = useMemo(() => {
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
      map[key].expenses +=
        Number(e.unit_price ?? 0) * Number(e.quantity ?? 1);
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

  // ── slider: blended "net snapshot" ────────────────────────────────────────
  // 0   = show expenses only (negative view)
  // 50  = balanced (actual net)
  // 100 = show revenue only (positive view)
  const sliderNet = useMemo(() => {
    const t = sliderValue / 100; // 0 → 1
    const revenueShare = totalRevenue * t;
    const expenseShare = totalExpenses * (1 - t);
    return revenueShare - expenseShare;
  }, [sliderValue, totalRevenue, totalExpenses]);

  const sliderLabel =
    sliderValue < 33
      ? "Expense-Heavy View"
      : sliderValue > 66
      ? "Revenue-Heavy View"
      : "Balanced View";

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
    <div className="flex h-screen p-6 md:p-0 lg:p-0 lg:flex-row md:flex-row flex-col overflow-hidden">
      {/* Sidebar */}
      <div className="w-full md:w-48 lg:w-64">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 space-y-6 p-6 md:p-24 lg:p-24 overflow-auto">
        <Header
          header="Finances"
          subheader="An overview of your gym's financial health — revenue, expenses, and net profit."
        />

        {/* ── Stat Cards ── */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {statCards.map((c) => (
            <Cards
              key={c.key}
              Card_Header={c.Card_Header}
              Card_Subheader={c.Card_Subheader}
              Card_Figure={c.Card_Figure}
              icon={c.icon}
              iconBg={c.iconBg}
            />
          ))}
        </div>

        {/* ── Slider Section ── */}
        <div className="bg-white rounded-2xl p-12 flex flex-col w-full">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <Header
              header="Revenue vs. Expenses Slider"
              subheader="Drag to adjust the balance between revenue and expense weighting."
            />
            <span className="text-sm font-semibold px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 shrink-0">
              {sliderLabel}
            </span>
          </div>

          {/* Slider */}
          <input
            id="finance-slider"
            type="range"
            min={0}
            max={100}
            value={sliderValue}
            onChange={(e) => setSliderValue(Number(e.target.value))}
            className="range range-primary w-full mt-6"
          />

          <div className="flex justify-between text-xs text-gray-400 font-medium">
            <span>⬅ Expenses</span>
            <span>Revenue ➡</span>
          </div>

          {/* Derived metric */}
          <div className="flex items-center gap-4 mt-2">
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-5 text-center">
              <p className="text-sm text-gray-500 mb-1">Weighted Balance</p>
              <p
                className={`text-3xl font-extrabold ${
                  sliderNet >= 0 ? "text-emerald-600" : "text-rose-500"
                }`}
              >
                {formatPeso(sliderNet)}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Based on {sliderValue}% revenue / {100 - sliderValue}% expense weighting
              </p>
            </div>

            {/* Mini breakdown bars */}
            <div className="flex-1 space-y-3">
              <div>
                <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
                  <span>Revenue share</span>
                  <span>{formatPeso(totalRevenue * (sliderValue / 100))}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-blue-400 h-3 rounded-full transition-all duration-200"
                    style={{ width: `${sliderValue}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
                  <span>Expense share</span>
                  <span>{formatPeso(totalExpenses * ((100 - sliderValue) / 100))}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-rose-400 h-3 rounded-full transition-all duration-200"
                    style={{ width: `${100 - sliderValue}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bar Chart ── */}
        <div style={{ height: "450px" }}>
          <MonthlyProfitBarChart data={monthlyData} />
        </div>
      </div>
    </div>
  );
}
