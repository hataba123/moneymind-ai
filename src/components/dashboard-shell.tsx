"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, ChartPie, Menu, Settings, Target, WalletCards } from "lucide-react";
import { AuthButton } from "@/components/auth-button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: ChartPie },
  { href: "/transactions", label: "Giao dịch", icon: WalletCards },
  { href: "/budgets", label: "Ngân sách", icon: Target },
  { href: "/ai-assistant", label: "AI Assistant", icon: Bot },
  { href: "/settings", label: "Cài đặt", icon: Settings },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-blue-100 bg-white px-4 py-5 lg:block">
        <Link href="/dashboard" className="flex items-center gap-3 px-2 font-semibold text-slate-900">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-blue-700 text-white">
            <WalletCards size={22} />
          </span>
          MoneyMind AI
        </Link>
        <nav className="mt-8 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold transition ${
                  active ? "bg-blue-700 text-white" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-blue-100 bg-white/95 px-4 backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            <Menu className="lg:hidden" size={22} />
            <span className="font-semibold text-slate-900">Quản lý tài chính</span>
          </div>
          <AuthButton compact />
        </header>
        <nav className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold ${
                pathname === item.href ? "bg-blue-700 text-white" : "bg-blue-50 text-blue-700"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <main className="mx-auto max-w-7xl px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}
