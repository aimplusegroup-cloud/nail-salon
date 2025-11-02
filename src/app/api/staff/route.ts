import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/staff
 * دریافت لیست پرسنل
 */
export async function GET() {
  try {
    const staff = await prisma.staff.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(staff);
  } catch (err) {
    console.error("GET /staff error:", err);
    return NextResponse.json([], { status: 200 });
  }
}

/**
 * POST /api/staff
 * افزودن پرسنل جدید
 */
export async function POST(req: Request) {
  try {
    const {
      name,
      bio,
      phone,
      email,
      role,
      skills,
      avatarUrl,
      employmentType,
      baseSalary,
      commission,
    } = await req.json();

    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, error: "نام پرسنل الزامی است" },
        { status: 400 }
      );
    }

    const created = await prisma.staff.create({
      data: {
        name,
        bio,
        phone,
        email,
        role,
        skills,
        avatarUrl,
        employmentType,
        baseSalary,
        commission,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("POST /staff error:", err);
    return NextResponse.json(
      { success: false, error: "خطای داخلی سرور" },
      { status: 500 }
    );
  }
}
