import { NextResponse } from "next/server";
import { getRequiredUserId } from "@/lib/session";
import { createAiAdvice, listAiAdviceLogs } from "@/services/aiFinanceService";
import { aiQuestionSchema } from "@/validators/finance";

export async function GET() {
  try {
    const userId = await getRequiredUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const logs = await listAiAdviceLogs(userId);
    return NextResponse.json({ logs });
  } catch {
    return NextResponse.json({ error: "Không thể tải lịch sử tư vấn" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getRequiredUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = aiQuestionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Câu hỏi không hợp lệ" }, { status: 400 });
    }

    const log = await createAiAdvice(userId, parsed.data.question);
    return NextResponse.json({ log });
  } catch {
    return NextResponse.json({ error: "Không thể tạo tư vấn AI" }, { status: 500 });
  }
}
