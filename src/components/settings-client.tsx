"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Trash2 } from "lucide-react";
import type { CategoryDto } from "@/types/finance";

export function SettingsClient() {
  const { data: session } = useSession();
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    const response = await fetch("/api/categories");
    const data = (await response.json()) as { categories?: CategoryDto[]; error?: string };
    if (!response.ok) {
      setError(data.error ?? "Không thể tải danh mục");
    } else {
      setCategories(data.categories ?? []);
    }
    setLoading(false);
  }, []);

  async function addCustomCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = (await response.json()) as { error?: string };
    if (!response.ok) {
      setError(data.error ?? "Không thể thêm danh mục");
      return;
    }
    setName("");
    await loadCategories();
  }

  async function deleteCustomCategory(id: string) {
    setError("");
    const response = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
    const data = (await response.json()) as { error?: string };
    if (!response.ok) {
      setError(data.error ?? "Không thể xóa danh mục");
      return;
    }
    await loadCategories();
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadCategories();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadCategories]);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <section className="money-card rounded-lg p-5">
        <h2 className="font-semibold text-slate-900">Tài khoản</h2>
        <div className="mt-4 space-y-2 text-sm text-slate-700">
          <p><span className="font-semibold">Tên:</span> {session?.user?.name ?? "Chưa có"}</p>
          <p><span className="font-semibold">Email:</span> {session?.user?.email ?? "Chưa có"}</p>
        </div>
        <form onSubmit={addCustomCategory} className="mt-6 space-y-3">
          <label className="block text-sm font-medium text-slate-700">
            Thêm danh mục tùy chỉnh
            <input className="focus-ring mt-1 h-11 w-full rounded-md border border-slate-200 px-3" value={name} onChange={(event) => setName(event.target.value)} placeholder="Ví dụ: Du lịch" />
          </label>
          {error && <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
          <button className="h-11 w-full rounded-md bg-blue-700 font-semibold text-white hover:bg-blue-800">Thêm danh mục</button>
        </form>
      </section>
      <section className="money-card rounded-lg p-5">
        <h2 className="font-semibold text-slate-900">Danh mục</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {loading ? <p className="text-sm text-slate-500">Đang tải...</p> : categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between rounded-md border border-slate-100 bg-white p-3">
              <div>
                <p className="font-semibold text-slate-800">{category.name}</p>
                <p className="text-xs text-slate-500">{category.isDefault ? "Mặc định" : "Tùy chỉnh"}</p>
              </div>
              {!category.isDefault && (
                <button type="button" onClick={() => void deleteCustomCategory(category.id)} className="grid h-9 w-9 place-items-center rounded-md border border-rose-200 text-rose-700" title="Xóa">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
