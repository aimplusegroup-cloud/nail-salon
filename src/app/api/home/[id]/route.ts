import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

// ---------------------- GET → دریافت یک آیتم ----------------------
export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

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
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
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
        title: body.title ?? undefined,
        text: body.text ?? undefined,
        imageUrl: body.imageUrl ?? undefined,
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
export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
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

    // اگر تصویر در Supabase ذخیره شده باشد، حذفش کن
    if (item.imageUrl && item.imageUrl.includes("/storage/v1/object/public/gallery/")) {
      const idx = item.imageUrl.indexOf("/gallery/");
      const objectPath = item.imageUrl.slice(idx + "/gallery/".length); // home/filename.jpg

      const { error: delError } = await supabaseServer.storage
        .from("gallery") // 👈 تغییر به اسم واقعی باکت
        .remove([objectPath]);

      if (delError) {
        console.warn("⚠️ Supabase remove warning:", delError);
      } else {
        console.log("🗑️ فایل تصویر از Supabase حذف شد:", objectPath);
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
