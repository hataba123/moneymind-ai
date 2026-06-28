"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { WalletCards } from "lucide-react";
import { AuthButton } from "@/components/auth-button";

export function Navbar() {
  const { status } = useSession();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 md:px-8">
        <Link href="/" className="flex items-center gap-3 font-semibold text-slate-950">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-slate-950 text-teal-300">
            <WalletCards size={22} />
          </span>
          <span>MoneyMind AI</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link href="/dashboard" className="hover:text-slate-950">Dashboard</Link>
          <Link href="/transactions" className="hover:text-slate-950">Giao dịch</Link>
          <Link href="/ai-assistant" className="hover:text-slate-950">AI Assistant</Link>
        </nav>
        <AuthButton compact loading={status === "loading"} />
      </div>
    </header>
  );
}
