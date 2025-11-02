import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

function getUserFromRequest(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/user_token=([^;]+)/);
  if (!match) return null;

  try {
    return jwt.verify(match[1], process.env.JWT_SECRET!);
  } catch {
    return null;
  }
}

// گرفتن همه نظرات
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all");

    const items = await prisma.testimonial.findMany({
      where: all ? {} : { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(items);
  } catch (err) {
    console.error("❌ GET testimonials error:", err);
    return NextResponse.json(
      { success: false, message: "خطا در دریافت نظرات" },
      { status: 500 }
    );
  }
}

// افزودن نظر جدید (فقط کاربر لاگین کرده)
export async function POST(req: Request) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "برای ثبت نظر باید وارد شوید" },
        { status: 401 }
      );
    }

    const body = await req.json();
    if (!body.text) {
      return NextResponse.json(
        { success: false, message: "متن نظر الزامی است" },
        { status: 400 }
      );
    }

    const item = await prisma.testimonial.create({
      data: {
        name: (user as any).phone, // یا اگر name در User داری، از آن استفاده کن
        text: body.text,
        status: "PENDING",
        userId: (user as any).id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "نظر شما ثبت شد و پس از تایید مدیر نمایش داده خواهد شد",
      item,
    });
  } catch (err) {
    console.error("❌ POST testimonials error:", err);
    return NextResponse.json(
      { success: false, message: "خطا در افزودن نظر" },
      { status: 500 }
    );
  }
}

// ویرایش یا تغییر وضعیت نظر (برای مدیر)
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json(
        { success: false, message: "شناسه نظر الزامی است" },
        { status: 400 }
      );
    }

    const data: any = {};
    if (body.name) data.name = body.name;
    if (body.text) data.text = body.text;
    if (body.status) data.status = body.status;

    const item = await prisma.testimonial.update({
      where: { id: body.id },
      data,
    });

    return NextResponse.json({ success: true, item });
  } catch (err) {
    console.error("❌ PUT testimonials error:", err);
    return NextResponse.json(
      { success: false, message: "خطا در ویرایش نظر" },
      { status: 500 }
    );
  }
}

// حذف نظر
export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json(
        { success: false, message: "شناسه نظر الزامی است" },
        { status: 400 }
      );
    }

    await prisma.testimonial.delete({ where: { id: body.id } });
    return NextResponse.json({ success: true, message: "نظر حذف شد" });
  } catch (err) {
    console.error("❌ DELETE testimonials error:", err);
    return NextResponse.json(
      { success: false, message: "خطا در حذف نظر" },
      { status: 500 }
    );
  }
}
