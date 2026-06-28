import { NextResponse } from "next/server";
import { getRequiredUserId } from "@/lib/session";
import { connectMongoDB } from "@/lib/mongodb";
import { seedDemoStore } from "@/services/demoStore";
import { createTransaction } from "@/services/transactionService";
import { upsertBudget } from "@/services/budgetService";
import { seedSamples } from "@/services/seedSamples";

export async function POST() {
  try {
    const userId = await getRequiredUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await connectMongoDB();
    if (!db) {
      seedDemoStore(userId);
      return NextResponse.json({ ok: true });
    }

    for (const transaction of seedSamples.transactions) {
      await createTransaction(userId, transaction);
    }

    for (const budget of seedSamples.budgets) {
      await upsertBudget(userId, budget);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Không thể tạo dữ liệu demo" }, { status: 500 });
  }
}
