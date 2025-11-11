import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * PATCH /api/reservations/[id]
 * تغییر وضعیت رزرو
 */
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> } // 🔑 باید Promise باشه
) {
  try {
    const { id } = await context.params; // 🔑 await لازم است
    const { status } = await req.json();

    // بررسی مقدار وضعیت
    if (!["PENDING", "CONFIRMED", "CANCELED", "COMPLETED"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "وضعیت نامعتبر" },
        { status: 400 }
      );
    }

    const reservation = await prisma.reservation.update({
      where: { id },
      data: { status },
      include: {
        user: true,     // 👈 جایگزین customer
        service: true,
        staff: true,
      },
    });

    return NextResponse.json({ success: true, reservation }, { status: 200 });
  } catch (err) {
    console.error("❌ PATCH /reservations/[id] error:", err);
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
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await prisma.reservation.delete({ where: { id } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("❌ DELETE /reservations/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "خطای داخلی سرور" },
      { status: 500 }
    );
  }
}
