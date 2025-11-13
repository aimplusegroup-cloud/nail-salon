import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { TestimonialStatus } from "@prisma/client";
import { getUserFromRequest, UserPayload } from "@/lib/auth";

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

// افزودن نظر جدید (کاربر یا مدیر لاگین کرده)
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
    const text = typeof body?.text === "string" ? body.text.trim() : "";
    if (!text) {
      return NextResponse.json(
        { success: false, message: "متن نظر الزامی است" },
        { status: 400 }
      );
    }

    const isAdmin = user.role === "admin";
    const displayName =
      (user as UserPayload).name ??
      (user as UserPayload).phone ??
      (user as UserPayload).email ??
      (isAdmin ? "مدیر" : "ناشناس");

    const item = await prisma.testimonial.create({
      data: {
        name: displayName,
        text,
        status: TestimonialStatus.PENDING,
        // 👇 تغییر اصلی: فقط کاربر عادی به جدول User وصل می‌شود
        userId: isAdmin ? null : String(user.id),
      },
    });

    return NextResponse.json({
      success: true,
      message: "نظر ثبت شد و پس از تایید مدیر نمایش داده خواهد شد",
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

// ویرایش یا تغییر وضعیت نظر (فقط مدیر)
export async function PUT(req: Request) {
  try {
    const user = getUserFromRequest(req);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "دسترسی غیرمجاز" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const id = body?.id as string | undefined;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "شناسه نظر الزامی است" },
        { status: 400 }
      );
    }

    const allowedStatuses = ["PENDING", "APPROVED", "REJECTED"] as const;
    const data: { name?: string; text?: string; status?: TestimonialStatus } = {};

    if (typeof body?.name === "string" && body.name.trim()) data.name = body.name.trim();
    if (typeof body?.text === "string" && body.text.trim()) data.text = body.text.trim();
    if (typeof body?.status === "string" && allowedStatuses.includes(body.status)) {
      data.status = body.status as TestimonialStatus;
    }

    const item = await prisma.testimonial.update({ where: { id }, data });
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

// حذف نظر (فقط مدیر)
export async function DELETE(req: Request) {
  try {
    const user = getUserFromRequest(req);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "دسترسی غیرمجاز" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const id = body?.id as string | undefined;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "شناسه نظر الزامی است" },
        { status: 400 }
      );
    }

    await prisma.testimonial.delete({ where: { id } });
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
