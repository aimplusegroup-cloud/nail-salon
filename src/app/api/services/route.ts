import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/services
 * دریافت لیست خدمات
 */
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(services);
  } catch (err) {
    console.error("GET /services error:", err);
    return NextResponse.json([], { status: 200 });
  }
}

/**
 * POST /api/services
 * افزودن خدمت جدید
 */
export async function POST(req: Request) {
  try {
    const { name, durationMin, price } = await req.json();
    if (!name?.trim() || !durationMin || !price) {
      return NextResponse.json(
        { success: false, error: "اطلاعات ناقص است" },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: { name, durationMin, price },
    });
    return NextResponse.json(service, { status: 201 });
  } catch (err) {
    console.error("POST /services error:", err);
    return NextResponse.json(
      { success: false, error: "خطای داخلی سرور" },
      { status: 500 }
    );
  }
}
