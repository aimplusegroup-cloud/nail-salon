import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabaseServer";

// GET → دریافت همه محتواها
export async function GET() {
  try {
    const items = await prisma.homeContent.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(items);
  } catch (err) {
    console.error("❌ GET /api/home error:", err);
    return NextResponse.json(
      { success: false, message: "خطا در دریافت داده‌ها" },
      { status: 500 }
    );
  }
}

// POST → افزودن متن یا عکس جدید (آپلود به Supabase)
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = (formData.get("title") as string | null)?.trim() ?? "";
    const text = (formData.get("text") as string | null)?.trim() ?? "";
    const file = formData.get("file") as File | null;

    if (!title) {
      return NextResponse.json(
        { success: false, message: "عنوان الزامی است" },
        { status: 400 }
      );
    }

    let imageUrl: string | null = null;

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const safeName = file.name.replace(/\s+/g, "-").toLowerCase();
      const objectPath = `home/${Date.now()}-${safeName}`;

      const { error: uploadError } = await supabaseServer.storage
        .from("uploads")
        .upload(objectPath, buffer, {
          contentType: file.type || "application/octet-stream",
          upsert: false,
        });

      if (uploadError) {
        console.error("❌ Supabase upload error:", uploadError);
        return NextResponse.json(
          { success: false, message: "خطا در آپلود تصویر" },
          { status: 500 }
        );
      }

      const { data: pub } = supabaseServer.storage
        .from("uploads")
        .getPublicUrl(objectPath);

      imageUrl = pub?.publicUrl ?? null;
    }

    const item = await prisma.homeContent.create({
      data: {
        title,
        text: text || null,
        imageUrl,
      },
    });

    return NextResponse.json({ success: true, item });
  } catch (err) {
    console.error("❌ POST /api/home error:", err);
    return NextResponse.json(
      { success: false, message: "خطا در ذخیره‌سازی محتوا" },
      { status: 500 }
    );
  }
}
