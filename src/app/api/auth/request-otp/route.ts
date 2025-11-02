import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendSMS } from "@/lib/smsClient";

export async function POST(req: Request) {
  const { phone } = await req.json();

  if (!phone) {
    return NextResponse.json({ success: false, message: "شماره الزامی است" }, { status: 400 });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  await prisma.oTP.upsert({
    where: { phone },
    update: { code, expiresAt: new Date(Date.now() + 5 * 60 * 1000) },
    create: { phone, code, expiresAt: new Date(Date.now() + 5 * 60 * 1000) },
  });

  try {
    await sendSMS(phone, `کد ورود شما: ${code}`);
  } catch (err) {
    console.error("SMS error:", err);
  }

  return NextResponse.json({ success: true, message: "کد ارسال شد" });
}
