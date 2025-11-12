import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabaseServer"; // کلاینت سروری با service_role

/**
 * PUT /api/gallery/[id]
 * ویرایش عنوان و توضیحات یک آیتم گالری
 */
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
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
 * حذف یک آیتم گالری بر اساس id (از Supabase Storage + دیتابیس)
 */
export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
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

    // حذف فایل از Supabase Storage
    if (item.imageUrl) {
      // مسیر فایل داخل bucket رو از URL عمومی استخراج کن
      const parts = item.imageUrl.split("/"); 
      const filePath = parts.slice(parts.indexOf("gallery")).join("/"); 

      const { error: removeError } = await supabaseServer.storage
        .from("gallery")
        .remove([filePath]);

      if (removeError) {
        console.warn("⚠️ خطا در حذف فایل از Supabase:", removeError.message);
      } else {
        console.log("🗑️ فایل تصویر از Supabase حذف شد:", filePath);
      }
    }

    // حذف رکورد از دیتابیس
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
