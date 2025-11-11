import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma"; // ✅ فقط import از lib

/**
 * POST /api/admin/reset
 * تغییر رمز عبور با استفاده از توکن معتبر
 */
export async function POST(req: Request) {
  try {
    const { token, password, confirmPassword } = await req.json();

    // بررسی ورودی‌ها
    if (!token || !password || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: "اطلاعات ناقص ارسال شده است" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "رمز و تأیید رمز یکسان نیستند" },
        { status: 400 }
      );
    }

    // پیدا کردن ادمین با توکن معتبر و تاریخ انقضا
    const admin = await prisma.admin.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "توکن نامعتبر یا منقضی شده است" },
        { status: 400 }
      );
    }

    // هش کردن رمز جدید
    const hash = await bcrypt.hash(password, 10);

    // بروزرسانی رمز و پاک کردن توکن
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        password: hash,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json(
      { success: true, message: "رمز عبور با موفقیت تغییر کرد ✅" },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Reset password error:", err);
    return NextResponse.json(
      { success: false, message: "خطا در پردازش درخواست" },
      { status: 500 }
    );
  }
}
