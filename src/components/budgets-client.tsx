"use client";

import { useCallback, useEffect, useState } from "react";
import { currencyFormatter, getCurrentMonthKey } from "@/lib/constants";
import type { BudgetDto, CategoryDto } from "@/types/finance";

export function BudgetsClient() {
  const [budgets, setBudgets] = useState<BudgetDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [form, setForm] = useState({ category: "Ăn uống", month: getCurrentMonthKey(), amount: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    const [budgetResponse, categoryResponse] = await Promise.all([
      fetch(`/api/budgets?month=${form.month}`),
      fetch("/api/categories"),
    ]);
    const budgetData = (await budgetResponse.json()) as { budgets?: BudgetDto[]; error?: string };
    const categoryData = (await categoryResponse.json()) as { categories?: CategoryDto[] };
    if (!budgetResponse.ok) {
      setError(budgetData.error ?? "Không thể tải ngân sách");
    } else {
      setBudgets(budgetData.budgets ?? []);
    }
    if (categoryResponse.ok) {
      setCategories(categoryData.categories ?? []);
    }
    setLoading(false);
  }, [form.month]);

  async function saveBudget(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/budgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, amount: Number(form.amount) }),
    });
    const data = (await response.json()) as { error?: string };
    if (!response.ok) {
      setError(data.error ?? "Không thể lưu ngân sách");
      return;
    }
    setForm((current) => ({ ...current, amount: "" }));
    await loadData();
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadData]);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.4fr]">
      <section className="money-card rounded-lg p-5">
        <h2 className="font-semibold text-slate-950">Tạo ngân sách</h2>
        <form onSubmit={saveBudget} className="mt-4 space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Tháng
            <input className="focus-ring mt-1 h-11 w-full rounded-md border border-slate-200 px-3" type="month" value={form.month} onChange={(event) => setForm({ ...form, month: event.target.value })} />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Danh mục
            <select className="focus-ring mt-1 h-11 w-full rounded-md border border-slate-200 px-3" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
              {categories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Hạn mức
            <input className="focus-ring mt-1 h-11 w-full rounded-md border border-slate-200 px-3" type="number" min="1" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} required />
          </label>
          {error && <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
          <button className="h-11 w-full rounded-md bg-slate-950 font-semibold text-white hover:bg-slate-800">Lưu ngân sách</button>
        </form>
      </section>
      <section className="money-card rounded-lg p-5">
        <h2 className="font-semibold text-slate-950">Theo dõi ngân sách</h2>
        <div className="mt-4 space-y-4">
          {loading ? <p className="text-sm text-slate-500">Đang tải...</p> : budgets.length ? budgets.map((budget) => (
            <div key={budget.id} className="rounded-md border border-slate-100 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-950">{budget.category}</p>
                  <p className="text-sm text-slate-500">{currencyFormatter.format(budget.spent)} / {currencyFormatter.format(budget.amount)}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-sm font-semibold ${budget.percentUsed >= 100 ? "bg-rose-100 text-rose-700" : budget.percentUsed >= 80 ? "bg-amber-100 text-amber-800" : "bg-teal-100 text-teal-700"}`}>
                  {budget.percentUsed}%
                </span>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full ${budget.percentUsed >= 100 ? "bg-rose-600" : budget.percentUsed >= 80 ? "bg-amber-500" : "bg-teal-600"}`} style={{ width: `${Math.min(budget.percentUsed, 100)}%` }} />
              </div>
              {budget.percentUsed >= 100 && <p className="mt-3 text-sm font-medium text-rose-700">Đã vượt ngân sách 100%.</p>}
              {budget.percentUsed >= 80 && budget.percentUsed < 100 && <p className="mt-3 text-sm font-medium text-amber-800">Đã vượt ngưỡng cảnh báo 80%.</p>}
            </div>
          )) : (
            <div className="rounded-md bg-slate-50 p-8 text-center text-sm text-slate-500">Chưa có ngân sách cho tháng này.</div>
          )}
        </div>
      </section>
    </div>
  );
}
