import Link from "next/link";
import { ArrowRight, Brain, ChartPie, ShieldCheck, Sparkles } from "lucide-react";
import { Navbar } from "@/components/navbar";

const features = [
  {
    title: "Theo dõi thu chi",
    description: "Ghi lại giao dịch, lọc theo ngày, loại, danh mục và ghi chú.",
    icon: ChartPie,
  },
  {
    title: "AI tài chính",
    description: "Nhận gợi ý tiết kiệm, cảnh báo bất thường và kế hoạch tháng sau.",
    icon: Brain,
  },
  {
    title: "Dữ liệu riêng tư",
    description: "Mỗi tài khoản chỉ xem và chỉnh sửa dữ liệu của chính mình.",
    icon: ShieldCheck,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="mx-auto grid min-h-[calc(100vh-76px)] max-w-7xl items-center gap-10 px-5 py-10 md:grid-cols-[1fr_0.9fr] md:px-8">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-4 py-2 text-sm font-medium text-teal-800">
            <Sparkles size={16} />
            MoneyMind AI cho tài chính cá nhân
          </div>
          <div className="space-y-5">
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-slate-950 md:text-6xl">
              Quản lý tiền rõ ràng hơn, quyết định thông minh hơn.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              MoneyMind AI giúp bạn ghi thu chi, xem dashboard, theo dõi ngân sách và nhận phân tích AI dựa trên thói quen chi tiêu thực tế.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-slate-950 px-6 font-semibold text-white transition hover:bg-slate-800"
            >
              Mở dashboard <ArrowRight size={18} />
            </Link>
            <Link
              href="/transactions"
              className="inline-flex h-12 items-center justify-center rounded-md border border-slate-200 bg-white px-6 font-semibold text-slate-900 transition hover:border-teal-300"
            >
              Thêm giao dịch
            </Link>
          </div>
        </div>

        <div className="money-card rounded-lg p-5">
          <div className="rounded-md bg-slate-950 p-5 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-300">Số dư tháng này</p>
                <p className="mt-2 text-4xl font-semibold">+8.420.000đ</p>
              </div>
              <Brain className="text-teal-300" />
            </div>
            <div className="mt-10 grid grid-cols-3 gap-3">
              {["Ăn uống", "Đi lại", "Tiết kiệm"].map((label, index) => (
                <div key={label} className="rounded-md bg-white/10 p-3">
                  <p className="text-xs text-slate-300">{label}</p>
                  <div className="mt-4 h-20 rounded bg-gradient-to-t from-teal-300 to-amber-200" style={{ height: `${64 + index * 18}px` }} />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="rounded-md border border-slate-100 bg-white p-4">
                  <Icon className="text-teal-700" size={22} />
                  <h2 className="mt-3 font-semibold text-slate-950">{feature.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
