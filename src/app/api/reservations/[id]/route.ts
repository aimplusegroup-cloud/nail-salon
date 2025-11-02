import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * PATCH /api/reservations/[id]
 * تغییر وضعیت رزرو
 */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await req.json();

    // بررسی مقدار وضعیت
    if (!["PENDING", "CONFIRMED", "CANCELED", "COMPLETED"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "وضعیت نامعتبر" },
        { status: 400 }
      );
    }

    const reservation = await prisma.reservation.update({
      where: { id: params.id },
      data: { status },
      include: {
        user: true,     // 👈 جایگزین customer
        service: true,
        staff: true,
      },
    });

    return NextResponse.json({ success: true, reservation });
  } catch (err) {
    console.error("PATCH /reservations/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "خطای داخلی سرور" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/reservations/[id]
 * حذف رزرو
 */
export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.reservation.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /reservations/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "خطای داخلی سرور" },
      { status: 500 }
    );
  }
}
