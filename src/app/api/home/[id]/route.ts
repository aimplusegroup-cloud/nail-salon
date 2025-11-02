import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// ---------------------- GET → دریافت یک آیتم ----------------------
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.homeContent.findUnique({
      where: { id: params.id },
    });

    if (!item) {
      return NextResponse.json(
        { success: false, message: "مورد یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (err) {
    console.error("❌ GET /api/home/[id] error:", err);
    return NextResponse.json(
      { success: false, message: "خطا در دریافت داده" },
      { status: 500 }
    );
  }
}

// ---------------------- PUT → ویرایش آیتم ----------------------
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    if (!params.id) {
      return NextResponse.json(
        { success: false, message: "شناسه معتبر نیست" },
        { status: 400 }
      );
    }

    const updated = await prisma.homeContent.update({
      where: { id: params.id },
      data: {
        title: body.title,
        text: body.text,
        imageUrl: body.imageUrl, // 👈 تغییر نام یا مسیر عکس
        order: body.order ?? undefined,
      },
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (err) {
    console.error("❌ PUT /api/home/[id] error:", err);
    return NextResponse.json(
      { success: false, message: "خطا در ویرایش محتوا" },
      { status: 500 }
    );
  }
}

// ---------------------- DELETE → حذف آیتم ----------------------
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "شناسه معتبر نیست" },
        { status: 400 }
      );
    }

    // بررسی وجود آیتم
    const item = await prisma.homeContent.findUnique({ where: { id } });
    if (!item) {
      return NextResponse.json(
        { success: false, message: "مورد یافت نشد" },
        { status: 404 }
      );
    }

    // حذف فایل تصویر در صورت وجود
    if (item.imageUrl) {
      const safePath = item.imageUrl.replace(/^\/+/, ""); // حذف اسلش‌های اول
      const filePath = path.join(process.cwd(), "public", safePath);

      try {
        await fs.unlink(filePath);
        console.log("🗑️ فایل تصویر حذف شد:", filePath);
      } catch {
        console.warn("⚠️ فایل تصویر پیدا نشد یا قبلاً حذف شده بود:", filePath);
      }
    }

    // حذف رکورد از دیتابیس
    const deleted = await prisma.homeContent.delete({ where: { id } });

    return NextResponse.json({ success: true, item: deleted });
  } catch (err) {
    console.error("❌ DELETE /api/home/[id] error:", err);
    return NextResponse.json(
      { success: false, message: "خطا در حذف محتوا" },
      { status: 500 }
    );
  }
}
