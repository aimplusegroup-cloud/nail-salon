import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const { phone, code } = await req.json();

  const otp = await prisma.oTP.findUnique({ where: { phone } });
  if (!otp || otp.code !== code || otp.expiresAt < new Date()) {
    return NextResponse.json({ success: false, message: "کد نامعتبر است" }, { status: 400 });
  }

  let user = await prisma.user.findUnique({ where: { phone } });
  if (!user) {
    user = await prisma.user.create({ data: { phone } });
  }

  const token = jwt.sign({ id: user.id, phone: user.phone }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  const res = NextResponse.json({ success: true, user });
  res.cookies.set("user_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
