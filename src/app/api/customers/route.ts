import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/customers
 * دریافت لیست همه کاربران (مشتری‌ها)
 */
export async function GET() {
  try {
    const customers = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      { success: true, data: customers },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Customers GET error:", err);
    return NextResponse.json(
      { success: false, message: "خطا در دریافت لیست مشتری‌ها" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/customers
 * ایجاد مشتری جدید
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone } = body;

    if (!phone) {
      return NextResponse.json(
        { success: false, message: "شماره موبایل الزامی است" },
        { status: 400 }
      );
    }

    const newCustomer = await prisma.user.create({
      data: {
        name: name ?? null,
        phone,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: newCustomer,
        message: "مشتری با موفقیت ایجاد شد ✅",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("❌ Customers POST error:", err);
    return NextResponse.json(
      { success: false, message: "خطا در ایجاد مشتری" },
      { status: 500 }
    );
  }
}
