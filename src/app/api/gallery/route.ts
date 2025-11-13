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
 * اضافه کردن عکس جدید (استاتیک یا Supabase)
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const file = formData.get("file") as File | null;
    const imageUrl = formData.get("imageUrl") as string | null;

    if (!title || title.trim() === "") {
      return NextResponse.json(
        { success: false, message: "عنوان الزامی است" },
        { status: 400 }
      );
    }

    let finalUrl = "";
    let source = "supabase";

    if (file) {
      // آپلود به Supabase
      const bytes = await file.arrayBuffer();
      const buffer = new Uint8Array(bytes);
      const safeName = file.name.replace(/\s+/g, "-").toLowerCase();
      const fileName = `${Date.now()}-${safeName}`;

      const { error } = await supabaseServer.storage
        .from("gallery")
        .upload(fileName, buffer, {
          contentType: file.type || "image/jpeg",
          upsert: false,
        });

      if (error) {
        console.error("❌ Upload error:", error);
        return NextResponse.json(
          { success: false, message: "آپلود ناموفق بود" },
          { status: 500 }
        );
      }

      const { data } = supabaseServer.storage.from("gallery").getPublicUrl(fileName);
      finalUrl = data.publicUrl;
    } else if (imageUrl) {
      // مسیر استاتیک
      finalUrl = imageUrl;
      source = "static";
    } else {
      return NextResponse.json(
        { success: false, message: "فایل یا مسیر عکس الزامی است" },
        { status: 400 }
      );
    }

    const item = await prisma.galleryItem.create({
      data: {
        title,
        description: description?.trim() || null,
        imageUrl: finalUrl,
        source,
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

/**
 * DELETE /api/gallery
 * حذف رکورد گالری (مدیر)
 */
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    await prisma.galleryItem.delete({ where: { id } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("❌ DELETE /api/gallery error:", err);
    return NextResponse.json(
      { success: false, message: "خطا در حذف رکورد" },
      { status: 500 }
    );
  }
}
