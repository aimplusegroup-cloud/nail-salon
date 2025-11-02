import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

/**
 * PUT /api/gallery/[id]
 * ویرایش عنوان و توضیحات یک آیتم گالری
 */
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();

    if (!body.title || typeof body.title !== "string") {
      return NextResponse.json(
        { success: false, message: "عنوان معتبر نیست" },
        { status: 400 }
      );
    }

    const updated = await prisma.galleryItem.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description || null, // ← حالا معتبر چون در schema اضافه شده
      },
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (err: any) {
    console.error("❌ PUT /api/gallery/[id] error:", err);
    return NextResponse.json(
      { success: false, message: "خطا در ویرایش آیتم", error: String(err) },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/gallery/[id]
 * حذف یک آیتم گالری بر اساس id
 */
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    // بررسی وجود آیتم
    const item = await prisma.galleryItem.findUnique({
      where: { id: params.id },
    });

    if (!item) {
      return NextResponse.json(
        { success: false, message: "عکس پیدا نشد" },
        { status: 404 }
      );
    }

    // حذف فایل از public/uploads (اگر وجود داشت)
    if (item.imageUrl) {
      const filePath = path.join(
        process.cwd(),
        "public",
        item.imageUrl.replace(/^\/+/, "")
      );

      try {
        await fs.unlink(filePath);
      } catch {
        console.warn("⚠️ فایل تصویر پیدا نشد یا قبلاً حذف شده بود:", filePath);
      }
    }

    // حذف رکورد از دیتابیس
    await prisma.galleryItem.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("❌ DELETE /api/gallery/[id] error:", err);
    return NextResponse.json(
      { success: false, message: "خطای داخلی سرور", error: String(err) },
      { status: 500 }
    );
  }
}
