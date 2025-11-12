import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";

/**
 * GET /api/gallery
 * دریافت لیست گالری
 */
export async function GET() {
  try {
    const items = await prisma.galleryItem.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(items, { status: 200 });
  } catch (err) {
    console.error("❌ GET /api/gallery error:", err);
    return NextResponse.json(
      { success: false, message: "خطا در دریافت داده‌ها" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/gallery
 * آپلود عکس جدید به Supabase Storage
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const file = formData.get("file") as File | null;

    // اعتبارسنجی ورودی‌ها
    if (!title || title.trim() === "") {
      return NextResponse.json(
        { success: false, message: "عنوان الزامی است" },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { success: false, message: "فایل انتخاب نشده" },
        { status: 400 }
      );
    }

    // نام فایل امن و یکتا
    const safeName = file.name.replace(/\s+/g, "-");
    const fileName = `${Date.now()}-${safeName}`;

    // آپلود به Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(fileName, file, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      console.error("❌ Upload error:", uploadError);
      return NextResponse.json(
        { success: false, message: "آپلود ناموفق بود" },
        { status: 500 }
      );
    }

    // گرفتن URL عمومی
    const { data: publicData } = supabase.storage
      .from("gallery")
      .getPublicUrl(fileName);

    const publicUrl = publicData.publicUrl;

    // ذخیره رکورد در دیتابیس
    const item = await prisma.galleryItem.create({
      data: {
        title,
        description: description?.trim() || null,
        imageUrl: publicUrl, // لینک مستقیم Supabase
      },
    });

    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (err) {
    console.error("❌ POST /api/gallery error:", err);
    return NextResponse.json(
      { success: false, message: "خطای داخلی سرور" },
      { status: 500 }
    );
  }
}
