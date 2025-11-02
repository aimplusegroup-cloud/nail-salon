import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET → گرفتن همه متن‌ها
export async function GET() {
  try {
    const items = await prisma.siteContent.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ success: true, items });
  } catch (err) {
    console.error("❌ GET /api/site error:", err);
    return NextResponse.json(
      { success: false, message: "خطا در دریافت متن‌ها" },
      { status: 500 }
    );
  }
}

// PUT → ویرایش یا ایجاد متن
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { key, value } = body;

    if (!key || typeof key !== "string") {
      return NextResponse.json(
        { success: false, message: "کلید معتبر نیست" },
        { status: 400 }
      );
    }
    if (typeof value !== "string") {
      return NextResponse.json(
        { success: false, message: "مقدار معتبر نیست" },
        { status: 400 }
      );
    }

    const updated = await prisma.siteContent.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (err) {
    console.error("❌ PUT /api/site error:", err);
    return NextResponse.json(
      { success: false, message: "خطا در ذخیره متن" },
      { status: 500 }
    );
  }
}
