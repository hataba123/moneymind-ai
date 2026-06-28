import { NextResponse } from "next/server";
import { getRequiredUserId } from "@/lib/session";
import { getDashboardSummary } from "@/services/dashboardService";

export async function GET() {
  try {
    const userId = await getRequiredUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const summary = await getDashboardSummary(userId);
    return NextResponse.json({ summary });
  } catch {
    return NextResponse.json({ error: "Không thể tải dashboard" }, { status: 500 });
  }
}
