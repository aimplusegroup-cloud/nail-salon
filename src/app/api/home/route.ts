import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// GET → دریافت همه محتواها
export async function GET() {
  try {
    const items = await prisma.homeContent.findMany({
      orderBy: { createdAt: "desc" },
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

// POST → افزودن متن یا عکس جدید
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string | null;
    const text = formData.get("text") as string | null;
    const file = formData.get("file") as File | null;

    if (!title || title.trim() === "") {
      return NextResponse.json(
        { success: false, message: "عنوان الزامی است" },
        { status: 400 }
      );
    }

    let imageUrl: string | null = null;
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const safeName = file.name.replace(/\s+/g, "-");
      const fileName = `${Date.now()}-${safeName}`;
      const uploadDir = path.join(process.cwd(), "public/uploads");

      await mkdir(uploadDir, { recursive: true });

      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      imageUrl = `/uploads/${fileName}`;
    }

    const item = await prisma.homeContent.create({
      data: {
        title,
        text: text || null,
        imageUrl, // 👈 الان همیشه یا string هست یا null
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
