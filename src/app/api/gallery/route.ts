import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

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
 * آپلود عکس جدید
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

    // خواندن فایل
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // نام فایل امن
    const safeName = file.name.replace(/\s+/g, "-");
    const fileName = `${Date.now()}-${safeName}`;
    const uploadDir = path.join(process.cwd(), "public/uploads");

    // اطمینان از وجود پوشه
    await mkdir(uploadDir, { recursive: true });

    // ذخیره فایل روی دیسک
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    // ذخیره رکورد در دیتابیس
    const item = await prisma.galleryItem.create({
      data: {
        title,
        description: description?.trim() || null,
        imageUrl: `/uploads/${fileName}`, // مسیر قابل دسترس در public
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
