"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Pencil, Sparkles, Trash2 } from "lucide-react";
import { currencyFormatter } from "@/lib/constants";
import type { CategoryDto, PaymentMethod, TransactionDto, TransactionType } from "@/types/finance";

type FormState = {
  id?: string;
  type: TransactionType;
  amount: string;
  category: string;
  note: string;
  transactionDate: string;
  paymentMethod: PaymentMethod;
};

const emptyForm: FormState = {
  type: "expense",
  amount: "",
  category: "Ăn uống",
  note: "",
  transactionDate: new Date().toISOString().slice(0, 10),
  paymentMethod: "cash",
};

export function TransactionsClient() {
  const [transactions, setTransactions] = useState<TransactionDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [filters, setFilters] = useState({ type: "", category: "", startDate: "", endDate: "", search: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [suggestion, setSuggestion] = useState("");

  const query = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    return params.toString();
  }, [filters]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    const [transactionResponse, categoryResponse] = await Promise.all([
      fetch(`/api/transactions${query ? `?${query}` : ""}`),
      fetch("/api/categories"),
    ]);
    const transactionData = (await transactionResponse.json()) as { transactions?: TransactionDto[]; error?: string };
    const categoryData = (await categoryResponse.json()) as { categories?: CategoryDto[]; error?: string };

    if (!transactionResponse.ok) {
      setError(transactionData.error ?? "Không thể tải giao dịch");
    } else {
      setTransactions(transactionData.transactions ?? []);
    }
    if (categoryResponse.ok) {
      setCategories(categoryData.categories ?? []);
    }
    setLoading(false);
  }, [query]);

  async function saveTransaction(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      ...form,
      amount: Number(form.amount),
      transactionDate: form.transactionDate,
    };
    const response = await fetch("/api/transactions", {
      method: form.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await response.json()) as { error?: string };
    if (!response.ok) {
      setError(data.error ?? "Không thể lưu giao dịch");
    } else {
      setForm(emptyForm);
      setSuggestion("");
      await loadData();
    }
    setSaving(false);
  }

  async function removeTransaction(id: string) {
    setError("");
    const response = await fetch(`/api/transactions?id=${id}`, { method: "DELETE" });
    if (!response.ok) {
      setError("Không thể xóa giao dịch");
      return;
    }
    await loadData();
  }

  async function suggestCategory() {
    if (!form.note.trim()) {
      return;
    }
    const response = await fetch("/api/suggest-category", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: form.note }),
    });
    const data = (await response.json()) as { category?: string };
    if (response.ok && data.category) {
      setForm((current) => ({ ...current, category: data.category ?? current.category }));
      setSuggestion(data.category);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadData]);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.4fr]">
      <section className="money-card rounded-lg p-5">
        <h2 className="font-semibold text-slate-950">{form.id ? "Sửa giao dịch" : "Thêm giao dịch"}</h2>
        <form onSubmit={saveTransaction} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Loại">
              <select className="focus-ring h-11 w-full rounded-md border border-slate-200 px-3" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as TransactionType })}>
                <option value="expense">Chi</option>
                <option value="income">Thu</option>
              </select>
            </Field>
            <Field label="Số tiền">
              <input className="focus-ring h-11 w-full rounded-md border border-slate-200 px-3" type="number" min="1" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} required />
            </Field>
          </div>
          <Field label="Danh mục">
            <select className="focus-ring h-11 w-full rounded-md border border-slate-200 px-3" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
              {categories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}
            </select>
          </Field>
          <Field label="Ghi chú">
            <div className="flex gap-2">
              <input className="focus-ring h-11 flex-1 rounded-md border border-slate-200 px-3" value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} placeholder="Ví dụ: ăn sáng 35k" />
              <button type="button" onClick={suggestCategory} className="grid h-11 w-11 place-items-center rounded-md border border-slate-200 bg-white text-teal-700" title="Gợi ý danh mục">
                <Sparkles size={18} />
              </button>
            </div>
            {suggestion && <p className="mt-2 text-xs text-teal-700">Đã gợi ý: {suggestion}</p>}
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Ngày">
              <input className="focus-ring h-11 w-full rounded-md border border-slate-200 px-3" type="date" value={form.transactionDate} onChange={(event) => setForm({ ...form, transactionDate: event.target.value })} required />
            </Field>
            <Field label="Thanh toán">
              <select className="focus-ring h-11 w-full rounded-md border border-slate-200 px-3" value={form.paymentMethod} onChange={(event) => setForm({ ...form, paymentMethod: event.target.value as PaymentMethod })}>
                <option value="cash">Tiền mặt</option>
                <option value="bank">Ngân hàng</option>
                <option value="momo">MoMo</option>
                <option value="other">Khác</option>
              </select>
            </Field>
          </div>
          {error && <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
          <button type="submit" disabled={saving} className="h-11 w-full rounded-md bg-slate-950 font-semibold text-white hover:bg-slate-800 disabled:opacity-60">
            {saving ? "Đang lưu..." : form.id ? "Cập nhật" : "Thêm giao dịch"}
          </button>
        </form>
      </section>
      <section className="money-card rounded-lg p-5">
        <div className="grid gap-3 md:grid-cols-5">
          <select className="focus-ring h-10 rounded-md border border-slate-200 px-3 text-sm" value={filters.type} onChange={(event) => setFilters({ ...filters, type: event.target.value })}>
            <option value="">Tất cả loại</option>
            <option value="expense">Chi</option>
            <option value="income">Thu</option>
          </select>
          <select className="focus-ring h-10 rounded-md border border-slate-200 px-3 text-sm" value={filters.category} onChange={(event) => setFilters({ ...filters, category: event.target.value })}>
            <option value="">Tất cả danh mục</option>
            {categories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}
          </select>
          <input className="focus-ring h-10 rounded-md border border-slate-200 px-3 text-sm" type="date" value={filters.startDate} onChange={(event) => setFilters({ ...filters, startDate: event.target.value })} />
          <input className="focus-ring h-10 rounded-md border border-slate-200 px-3 text-sm" type="date" value={filters.endDate} onChange={(event) => setFilters({ ...filters, endDate: event.target.value })} />
          <input className="focus-ring h-10 rounded-md border border-slate-200 px-3 text-sm" placeholder="Search ghi chú" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} />
        </div>
        <div className="mt-5 overflow-x-auto">
          {loading ? <p className="text-sm text-slate-500">Đang tải...</p> : transactions.length ? (
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-slate-500">
                <tr><th className="py-2">Ngày</th><th>Loại</th><th>Danh mục</th><th>Ghi chú</th><th className="text-right">Số tiền</th><th></th></tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-t border-slate-100">
                    <td className="py-3">{new Date(transaction.transactionDate).toLocaleDateString("vi-VN")}</td>
                    <td>{transaction.type === "income" ? "Thu" : "Chi"}</td>
                    <td>{transaction.category}</td>
                    <td>{transaction.note}</td>
                    <td className={`text-right font-semibold ${transaction.type === "income" ? "text-teal-700" : "text-rose-700"}`}>{currencyFormatter.format(transaction.amount)}</td>
                    <td className="flex justify-end gap-2 py-2">
                      <button type="button" onClick={() => setForm({ id: transaction.id, type: transaction.type, amount: String(transaction.amount), category: transaction.category, note: transaction.note, transactionDate: transaction.transactionDate.slice(0, 10), paymentMethod: transaction.paymentMethod })} className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 text-slate-600" title="Sửa"><Pencil size={16} /></button>
                      <button type="button" onClick={() => void removeTransaction(transaction.id)} className="grid h-9 w-9 place-items-center rounded-md border border-rose-200 text-rose-700" title="Xóa"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="rounded-md bg-slate-50 p-8 text-center text-sm text-slate-500">Chưa có giao dịch nào trong bộ lọc hiện tại.</div>
          )}
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <span className="mt-1 block">{children}</span>
    </label>
  );
}
