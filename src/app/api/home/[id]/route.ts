import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// ---------------------- GET → دریافت یک آیتم ----------------------
export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> } // 🔑 در Next.js 15 باید Promise باشد
) {
  try {
    const { id } = await context.params; // 🔑 await لازم است

    const item = await prisma.homeContent.findUnique({
      where: { id },
    });

    if (!item) {
      return NextResponse.json(
        { success: false, message: "مورد یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json(item, { status: 200 });
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
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "شناسه معتبر نیست" },
        { status: 400 }
      );
    }

    const updated = await prisma.homeContent.update({
      where: { id },
      data: {
        title: body.title,
        text: body.text,
        imageUrl: body.imageUrl,
        order: body.order ?? undefined,
      },
    });

    return NextResponse.json({ success: true, item: updated }, { status: 200 });
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
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "شناسه معتبر نیست" },
        { status: 400 }
      );
    }

    const item = await prisma.homeContent.findUnique({ where: { id } });
    if (!item) {
      return NextResponse.json(
        { success: false, message: "مورد یافت نشد" },
        { status: 404 }
      );
    }

    if (item.imageUrl) {
      const safePath = item.imageUrl.replace(/^\/+/, "");
      const filePath = path.join(process.cwd(), "public", safePath);

      try {
        await fs.unlink(filePath);
        console.log("🗑️ فایل تصویر حذف شد:", filePath);
      } catch {
        console.warn("⚠️ فایل تصویر پیدا نشد یا قبلاً حذف شده بود:", filePath);
      }
    }

    const deleted = await prisma.homeContent.delete({ where: { id } });

    return NextResponse.json({ success: true, item: deleted }, { status: 200 });
  } catch (err) {
    console.error("❌ DELETE /api/home/[id] error:", err);
    return NextResponse.json(
      { success: false, message: "خطا در حذف محتوا" },
      { status: 500 }
    );
  }
}
