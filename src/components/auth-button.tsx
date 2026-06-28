"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { LogIn, LogOut } from "lucide-react";

type AuthButtonProps = {
  compact?: boolean;
  loading?: boolean;
};

export function AuthButton({ compact = false, loading = false }: AuthButtonProps) {
  const { data: session, status } = useSession();
  const isLoading = loading || status === "loading";

  if (isLoading) {
    return (
      <button className="h-10 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-500" disabled>
        Đang tải
      </button>
    );
  }

  if (session?.user) {
    return (
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:border-rose-200 hover:text-rose-700"
      >
        <LogOut size={16} />
        {compact ? "Thoát" : "Đăng xuất"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
    >
      <LogIn size={16} />
      {compact ? "Login" : "Đăng nhập Google"}
    </button>
  );
}
