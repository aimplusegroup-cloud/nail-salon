import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabaseServer"; // کلاینت سروری با service_role

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
 * آپلود عکس جدید به Supabase Storage (فقط مدیر)
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

    // تبدیل فایل به باینری برای آپلود مطمئن
    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);

    // نام فایل امن و یکتا
    const safeName = file.name.replace(/\s+/g, "-").toLowerCase();
    const fileName = `gallery/${Date.now()}-${safeName}`;

    // آپلود به Supabase Storage با service_role
    const { error: uploadError } = await supabaseServer.storage
      .from("gallery")
      .upload(fileName, buffer, {
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
    const { data: publicData } = supabaseServer.storage
      .from("gallery")
      .getPublicUrl(fileName);

    const publicUrl = publicData.publicUrl;

    // ذخیره رکورد در دیتابیس
    const item = await prisma.galleryItem.create({
      data: {
        title,
        description: description?.trim() || null,
        imageUrl: publicUrl,
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
