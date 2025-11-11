import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/notifications
 * دریافت لیست همه نوتیفیکیشن‌ها
 */
export async function GET() {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      { success: true, data: notifications },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ GET /api/notifications error:", err);
    return NextResponse.json(
      { success: false, message: "خطا در دریافت نوتیفیکیشن‌ها" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/notifications
 * ایجاد یک نوتیفیکیشن جدید
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, message, userId } = body;

    if (!title || !message) {
      return NextResponse.json(
        { success: false, message: "عنوان و متن نوتیفیکیشن الزامی است" },
        { status: 400 }
      );
    }

    const newNotification = await prisma.notification.create({
      data: {
        title,
        message,
        userId: userId ?? null, // اگر نوتیفیکیشن عمومی است، userId می‌تواند null باشد
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: newNotification,
        message: "نوتیفیکیشن ایجاد شد ✅",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("❌ POST /api/notifications error:", err);
    return NextResponse.json(
      { success: false, message: "خطا در ایجاد نوتیفیکیشن" },
      { status: 500 }
    );
  }
}
