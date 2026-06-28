import { NextResponse } from "next/server";
import { getRequiredUserId } from "@/lib/session";
import { createTransaction, deleteTransaction, listTransactions, updateTransaction } from "@/services/transactionService";
import { transactionFilterSchema, transactionSchema } from "@/validators/finance";

export async function GET(request: Request) {
  try {
    const userId = await getRequiredUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const parsed = transactionFilterSchema.safeParse({
      type: searchParams.get("type") || undefined,
      category: searchParams.get("category") || undefined,
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
      search: searchParams.get("search") || undefined,
    });
    if (!parsed.success) {
      return NextResponse.json({ error: "Bộ lọc không hợp lệ" }, { status: 400 });
    }

    const transactions = await listTransactions(userId, parsed.data);
    return NextResponse.json({ transactions });
  } catch {
    return NextResponse.json({ error: "Không thể tải giao dịch" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getRequiredUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = transactionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" }, { status: 400 });
    }

    const transaction = await createTransaction(userId, parsed.data);
    return NextResponse.json({ transaction }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Không thể tạo giao dịch" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const userId = await getRequiredUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = transactionSchema.safeParse(body);
    if (!parsed.success || !parsed.data.id) {
      return NextResponse.json({ error: parsed.error?.issues[0]?.message ?? "Thiếu id giao dịch" }, { status: 400 });
    }

    const transaction = await updateTransaction(userId, parsed.data);
    if (!transaction) {
      return NextResponse.json({ error: "Không tìm thấy giao dịch" }, { status: 404 });
    }

    return NextResponse.json({ transaction });
  } catch {
    return NextResponse.json({ error: "Không thể cập nhật giao dịch" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const userId = await getRequiredUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Thiếu id giao dịch" }, { status: 400 });
    }

    const deleted = await deleteTransaction(userId, id);
    if (!deleted) {
      return NextResponse.json({ error: "Không tìm thấy giao dịch" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Không thể xóa giao dịch" }, { status: 500 });
  }
}
