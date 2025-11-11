import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

/**
 * PUT /api/gallery/[id]
 * ویرایش عنوان و توضیحات یک آیتم گالری
 */
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }   // 🔑 باید Promise باشد
) {
  try {
    const { id } = await context.params; // 🔑 await لازم است
    const body = await req.json();

    if (!body.title || typeof body.title !== "string") {
      return NextResponse.json(
        { success: false, message: "عنوان معتبر نیست" },
        { status: 400 }
      );
    }

    const updated = await prisma.galleryItem.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description || null,
      },
    });

    return NextResponse.json({ success: true, item: updated }, { status: 200 });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : String(err);
    console.error("❌ PUT /api/gallery/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "خطا در ویرایش آیتم", error },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/gallery/[id]
 * حذف یک آیتم گالری بر اساس id
 */
export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }   // 🔑 باید Promise باشد
) {
  try {
    const { id } = await context.params;

    const item = await prisma.galleryItem.findUnique({ where: { id } });
    if (!item) {
      return NextResponse.json(
        { success: false, message: "عکس پیدا نشد" },
        { status: 404 }
      );
    }

    if (item.imageUrl) {
      const filePath = path.join(
        process.cwd(),
        "public",
        item.imageUrl.replace(/^\/+/, "")
      );
      try {
        await fs.unlink(filePath);
        console.log("🗑️ فایل تصویر حذف شد:", filePath);
      } catch (err: unknown) {
        const error = err instanceof Error ? err.message : String(err);
        console.warn("⚠️ فایل تصویر پیدا نشد یا قبلاً حذف شده بود:", filePath, error);
      }
    }

    await prisma.galleryItem.delete({ where: { id } });

    return NextResponse.json(
      { success: true, message: "آیتم با موفقیت حذف شد ✅" },
      { status: 200 }
    );
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : String(err);
    console.error("❌ DELETE /api/gallery/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "خطای داخلی سرور", error },
      { status: 500 }
    );
  }
}
