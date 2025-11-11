import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { TestimonialStatus } from "@prisma/client"; // 👈 اضافه شد

interface UserPayload extends JwtPayload {
  id: string;
  phone?: string;
  name?: string;
}

function getUserFromRequest(req: Request): UserPayload | null {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/user_token=([^;]+)/);
  if (!match) return null;

  try {
    return jwt.verify(match[1], process.env.JWT_SECRET!) as UserPayload;
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
      where: all ? {} : { status: TestimonialStatus.APPROVED },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(items);
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : String(err);
    console.error("❌ GET testimonials error:", error);
    return NextResponse.json(
      { success: false, message: "خطا در دریافت نظرات", error },
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
        name: user.name ?? user.phone ?? "ناشناس",
        text: body.text,
        status: TestimonialStatus.PENDING, // 👈 enum استفاده شد
        userId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "نظر شما ثبت شد و پس از تایید مدیر نمایش داده خواهد شد",
      item,
    });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : String(err);
    console.error("❌ POST testimonials error:", error);
    return NextResponse.json(
      { success: false, message: "خطا در افزودن نظر", error },
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

    const data: { name?: string; text?: string; status?: TestimonialStatus } = {};
    if (body.name) data.name = body.name;
    if (body.text) data.text = body.text;
    if (body.status && ["PENDING", "APPROVED", "REJECTED"].includes(body.status)) {
      data.status = body.status as TestimonialStatus;
    }

    const item = await prisma.testimonial.update({
      where: { id: body.id },
      data,
    });

    return NextResponse.json({ success: true, item });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : String(err);
    console.error("❌ PUT testimonials error:", error);
    return NextResponse.json(
      { success: false, message: "خطا در ویرایش نظر", error },
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
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : String(err);
    console.error("❌ DELETE testimonials error:", error);
    return NextResponse.json(
      { success: false, message: "خطا در حذف نظر", error },
      { status: 500 }
    );
  }
}
