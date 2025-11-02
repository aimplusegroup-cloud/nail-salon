import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

/**
 * POST /api/admin/forgot
 * ایجاد توکن ریست رمز عبور
 */
export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "مدیر یافت نشد" },
        { status: 404 }
      );
    }

    // ساخت توکن ریست
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 15); // ۱۵ دقیقه اعتبار

    await prisma.admin.update({
      where: { email },
      data: {
        resetToken: token,
        resetTokenExpiry: expires,
      },
    });

    // در MVP فقط در لاگ چاپ می‌کنیم
    console.log(`🔑 لینک ریست: http://localhost:3000/dashboard/reset?token=${token}`);

    return NextResponse.json(
      { success: true, message: "لینک ریست رمز ساخته شد" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json(
      { success: false, message: "خطا در پردازش درخواست" },
      { status: 500 }
    );
  }
}
