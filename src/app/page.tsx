import Link from "next/link";
import { ArrowRight, BarChart3, Bot, ShieldCheck, WalletCards } from "lucide-react";
import { Navbar } from "@/components/navbar";

const highlights = [
  { label: "Ghi thu chi", icon: WalletCards },
  { label: "Dashboard tháng", icon: BarChart3 },
  { label: "Gợi ý AI", icon: Bot },
  { label: "Dữ liệu riêng tư", icon: ShieldCheck },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="mx-auto grid min-h-[calc(100vh-76px)] max-w-7xl items-center gap-8 px-5 py-8 md:grid-cols-[0.95fr_1.05fr] md:px-8">
        <div className="space-y-7">
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
              Quản lý thu chi cá nhân trong một màn hình.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600">
              Theo dõi giao dịch, ngân sách và xu hướng chi tiêu hằng tháng. AI hỗ trợ phân tích khi bạn cần quyết định nhanh hơn.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-blue-700 px-6 font-semibold text-white transition hover:bg-blue-800"
            >
              Vào dashboard <ArrowRight size={18} />
            </Link>
            <Link
              href="/transactions"
              className="inline-flex h-12 items-center justify-center rounded-md border border-blue-200 bg-white px-6 font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              Thêm giao dịch
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-md border border-blue-100 bg-white p-4">
                  <Icon className="text-blue-700" size={20} />
                  <p className="mt-3 text-sm font-semibold text-slate-700">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="money-card rounded-lg p-5">
          <div className="flex items-center justify-between border-b border-blue-100 pb-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Tổng quan tháng này</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">8.420.000đ</p>
            </div>
            <span className="rounded-md bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">+18%</span>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              ["Thu nhập", "18.000.000đ"],
              ["Chi tiêu", "9.580.000đ"],
              ["Tiết kiệm", "47%"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-md bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">{label}</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 overflow-hidden rounded-md border border-blue-100">
            {[
              ["Ăn uống", "1.120.000đ", "62%"],
              ["Đi lại", "540.000đ", "38%"],
              ["Mua sắm", "690.000đ", "51%"],
            ].map(([label, value, percent]) => (
              <div key={label} className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-blue-50 p-4 last:border-b-0">
                <div>
                  <p className="font-medium text-slate-800">{label}</p>
                  <div className="mt-2 h-2 rounded-full bg-blue-50">
                    <div className="h-2 rounded-full bg-blue-600" style={{ width: percent }} />
                  </div>
                </div>
                <p className="font-semibold text-slate-900">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
