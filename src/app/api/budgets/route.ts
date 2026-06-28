import { NextResponse } from "next/server";
import { getRequiredUserId } from "@/lib/session";
import { listBudgets, upsertBudget } from "@/services/budgetService";
import { budgetSchema } from "@/validators/finance";

export async function GET(request: Request) {
  try {
    const userId = await getRequiredUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const budgets = await listBudgets(userId, searchParams.get("month") || undefined);
    return NextResponse.json({ budgets });
  } catch {
    return NextResponse.json({ error: "Không thể tải ngân sách" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getRequiredUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = budgetSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" }, { status: 400 });
    }

    const budget = await upsertBudget(userId, parsed.data);
    return NextResponse.json({ budget });
  } catch {
    return NextResponse.json({ error: "Không thể lưu ngân sách" }, { status: 500 });
  }
}
