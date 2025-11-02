import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * PUT /api/services/[id]
 * ویرایش خدمت
 */
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { name, durationMin, price } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "شناسه نامعتبر است" },
        { status: 400 }
      );
    }

    const updated = await prisma.service.update({
      where: { id },
      data: { name, durationMin, price },
    });

    return NextResponse.json({ success: true, service: updated });
  } catch (err) {
    console.error("PUT /services/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "خطا در ویرایش خدمت" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/services/[id]
 * حذف خدمت
 */
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "شناسه نامعتبر است" },
        { status: 400 }
      );
    }

    await prisma.service.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /services/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "خطا در حذف خدمت" },
      { status: 500 }
    );
  }
}
