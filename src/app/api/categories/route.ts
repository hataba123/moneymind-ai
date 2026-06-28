import { NextResponse } from "next/server";
import { getRequiredUserId } from "@/lib/session";
import { addCategory, deleteCategory, listCategories } from "@/services/categoryService";
import { categorySchema } from "@/validators/finance";

export async function GET() {
  try {
    const userId = await getRequiredUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const categories = await listCategories(userId);
    return NextResponse.json({ categories });
  } catch {
    return NextResponse.json({ error: "Không thể tải danh mục" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getRequiredUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" }, { status: 400 });
    }

    const category = await addCategory(userId, parsed.data.name);
    return NextResponse.json({ category }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Không thể thêm danh mục" }, { status: 500 });
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
      return NextResponse.json({ error: "Thiếu id danh mục" }, { status: 400 });
    }

    const deleted = await deleteCategory(userId, id);
    if (!deleted) {
      return NextResponse.json({ error: "Không thể xóa danh mục mặc định hoặc không tồn tại" }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Không thể xóa danh mục" }, { status: 500 });
  }
}
