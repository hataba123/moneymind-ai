"use client";

import { useCallback, useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Database } from "lucide-react";
import { currencyFormatter } from "@/lib/constants";
import type { DashboardSummary } from "@/types/finance";

const colors = ["#2563eb", "#1d4ed8", "#60a5fa", "#93c5fd", "#334155", "#64748b"];

export function DashboardClient() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    const response = await fetch("/api/dashboard");
    const data = (await response.json()) as { summary?: DashboardSummary; error?: string };
    if (!response.ok || !data.summary) {
      setError(data.error ?? "Không thể tải dashboard");
    } else {
      setSummary(data.summary);
    }
    setLoading(false);
  }, []);

  async function seedDemoData() {
    setSeeding(true);
    setError("");
    const response = await fetch("/api/demo-data", { method: "POST" });
    if (!response.ok) {
      setError("Không thể nạp dữ liệu mẫu");
    }
    await loadDashboard();
    setSeeding(false);
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadDashboard();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadDashboard]);

  if (loading) {
    return <div className="money-card rounded-lg p-6 text-slate-600">Đang tải dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {error && <div className="rounded-md border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}
      {summary ? (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <StatCard label="Thu tháng này" value={currencyFormatter.format(summary.incomeThisMonth)} tone="text-blue-700" />
            <StatCard label="Chi tháng này" value={currencyFormatter.format(summary.expenseThisMonth)} tone="text-rose-700" />
            <StatCard label="Số dư" value={currencyFormatter.format(summary.balance)} tone="text-slate-900" />
            <StatCard label="Tỷ lệ tiết kiệm" value={`${summary.savingRate}%`} tone="text-blue-700" />
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            <section className="money-card rounded-lg p-5">
              <h2 className="font-semibold text-slate-900">Chi theo danh mục</h2>
              <div className="mt-4 h-80">
                {summary.categoryChart.length ? (
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={summary.categoryChart} dataKey="amount" nameKey="category" outerRadius={110}>
                        {summary.categoryChart.map((entry, index) => (
                          <Cell key={entry.category} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => currencyFormatter.format(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChart />
                )}
              </div>
            </section>
            <section className="money-card rounded-lg p-5">
              <h2 className="font-semibold text-slate-900">Thu chi theo ngày</h2>
              <div className="mt-4 h-80">
                {summary.dailyChart.length ? (
                  <ResponsiveContainer>
                    <BarChart data={summary.dailyChart}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis tickFormatter={(value) => `${Number(value) / 1000}k`} />
                      <Tooltip formatter={(value) => currencyFormatter.format(Number(value))} />
                      <Bar dataKey="income" fill="#2563eb" name="Thu" />
                      <Bar dataKey="expense" fill="#94a3b8" name="Chi" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChart />
                )}
              </div>
            </section>
          </div>
          <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
            <section className="money-card rounded-lg p-5">
              <h2 className="font-semibold text-slate-900">Top danh mục chi nhiều</h2>
              <div className="mt-4 space-y-3">
                {summary.topExpenseCategories.length ? summary.topExpenseCategories.map((item) => (
                  <div key={item.category} className="flex items-center justify-between rounded-md bg-slate-50 p-3 text-sm">
                    <span className="font-medium text-slate-700">{item.category}</span>
                    <span className="font-semibold text-slate-900">{currencyFormatter.format(item.amount)}</span>
                  </div>
                )) : <EmptyText />}
              </div>
            </section>
            <section className="money-card rounded-lg p-5">
              <h2 className="font-semibold text-slate-900">Giao dịch gần đây</h2>
              <div className="mt-4 overflow-x-auto">
                {summary.recentTransactions.length ? (
                  <table className="w-full text-left text-sm">
                    <thead className="text-slate-500">
                      <tr>
                        <th className="py-2">Ngày</th>
                        <th>Danh mục</th>
                        <th>Ghi chú</th>
                        <th className="text-right">Số tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary.recentTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-t border-slate-100">
                          <td className="py-3">{new Date(transaction.transactionDate).toLocaleDateString("vi-VN")}</td>
                          <td>{transaction.category}</td>
                          <td>{transaction.note}</td>
                          <td className={`text-right font-semibold ${transaction.type === "income" ? "text-blue-700" : "text-rose-700"}`}>
                            {transaction.type === "income" ? "+" : "-"}{currencyFormatter.format(transaction.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <EmptyText />}
              </div>
            </section>
          </div>
        </>
      ) : (
        <button type="button" onClick={seedDemoData} disabled={seeding} className="money-card flex w-full items-center justify-center gap-2 rounded-lg p-10 font-semibold text-blue-700 disabled:opacity-60">
          <Database size={20} /> {seeding ? "Đang nạp..." : "Nạp dữ liệu mẫu"}
        </button>
      )}
    </div>
  );
}

function StatCard({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="money-card rounded-lg p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-3 text-2xl font-semibold ${tone}`}>{value}</p>
    </div>
  );
}

function EmptyChart() {
  return <div className="grid h-full place-items-center rounded-md bg-slate-50 text-sm text-slate-500">Chưa có dữ liệu biểu đồ</div>;
}

function EmptyText() {
  return <p className="rounded-md bg-slate-50 p-4 text-sm text-slate-500">Chưa có dữ liệu.</p>;
}
