import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

/**
 * POST /api/admin/change-password
 * تغییر رمز عبور مدیر
 */
export async function POST(req: Request) {
  try {
    const { email, oldPassword, newPassword } = await req.json();

    // پیدا کردن مدیر
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "مدیر یافت نشد" },
        { status: 404 }
      );
    }

    // بررسی رمز فعلی
    const valid = await bcrypt.compare(oldPassword, admin.password);
    if (!valid) {
      return NextResponse.json(
        { success: false, message: "رمز فعلی اشتباه است" },
        { status: 401 }
      );
    }

    // هش رمز جدید
    const newHash = await bcrypt.hash(newPassword, 10);

    await prisma.admin.update({
      where: { email },
      data: { password: newHash },
    });

    return NextResponse.json({
      success: true,
      message: "رمز عبور با موفقیت تغییر کرد ✅",
    });
  } catch (err) {
    console.error("Change password error:", err);
    return NextResponse.json(
      { success: false, message: "خطا در تغییر رمز" },
      { status: 500 }
    );
  }
}
