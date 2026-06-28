import Link from "next/link";
import { AuthButton } from "@/components/auth-button";
import { WalletCards } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center px-5">
      <section className="money-card w-full max-w-md rounded-lg p-6 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-md bg-slate-950 text-teal-300">
          <WalletCards />
        </div>
        <h1 className="mt-5 text-2xl font-semibold text-slate-950">Đăng nhập MoneyMind AI</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Dùng Google để bảo vệ dữ liệu thu chi và đồng bộ dashboard cá nhân của bạn.
        </p>
        <div className="mt-6">
          <AuthButton />
        </div>
        <Link href="/" className="mt-5 inline-block text-sm font-semibold text-teal-700">
          Quay lại trang chủ
        </Link>
      </section>
    </main>
  );
}
