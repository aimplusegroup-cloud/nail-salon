import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, password, remember, provider } = await req.json();

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json(
        { success: false, message: "JWT_SECRET تنظیم نشده" },
        { status: 500 }
      );
    }

    let admin = await prisma.admin.findUnique({ where: { email } });

    // 🔹 حالت ورود با Google
    if (provider === "google") {
      if (!admin) {
        admin = await prisma.admin.create({
          data: {
            email,
            password: "", // چون ورود با گوگل است
            provider: "google",
          },
        });
      }

      const token = jwt.sign(
        {
          id: admin.id,
          email: admin.email,
          provider: admin.provider,
          role: "admin", // 👈 نقش  مدیر اضافه شد
        },
        secret,
        { expiresIn: remember ? "7d" : "1h" }
      );

      const res = NextResponse.json(
        { success: true, message: "ورود با گوگل موفقیت‌آمیز بود" },
        { status: 200 }
      );

      res.cookies.set("admin_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: remember ? 60 * 60 * 24 * 7 : 60 * 60,
      });

      return res;
    }

    // 🔹 حالت ورود محلی
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "مدیر یافت نشد" },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return NextResponse.json(
        { success: false, message: "رمز عبور اشتباه است" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: "admin", // 👈 نقش مدیر اضافه شد
      },
      secret,
      { expiresIn: remember ? "7d" : "1h" }
    );

    const res = NextResponse.json(
      { success: true, message: "ورود موفقیت‌آمیز بود" },
      { status: 200 }
    );

    res.cookies.set("admin_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: remember ? 60 * 60 * 24 * 7 : 60 * 60,
    });

    return res;
  } catch (err) {
    console.error("❌ Login error:", err);
    return NextResponse.json(
      { success: false, message: "خطا در پردازش درخواست" },
      { status: 500 }
    );
  }
}
