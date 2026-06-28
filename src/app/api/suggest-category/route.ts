import { NextResponse } from "next/server";
import { getRequiredUserId } from "@/lib/session";
import { suggestCategory } from "@/services/categorySuggestionService";

export async function POST(request: Request) {
  try {
    const userId = await getRequiredUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as { note?: string };
    if (!body.note?.trim()) {
      return NextResponse.json({ error: "Thiếu ghi chú" }, { status: 400 });
    }

    const suggestion = await suggestCategory(body.note);
    return NextResponse.json(suggestion);
  } catch {
    return NextResponse.json({ error: "Không thể gợi ý danh mục" }, { status: 500 });
  }
}
