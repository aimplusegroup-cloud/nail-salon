import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * PUT /api/staff/[id]
 * ویرایش پرسنل
 */
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> } // 🔑 باید Promise باشد
) {
  try {
    const { id } = await context.params; // 🔑 await لازم است
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

    if (!id) {
      return NextResponse.json(
        { success: false, error: "شناسه نامعتبر است" },
        { status: 400 }
      );
    }

    const updated = await prisma.staff.update({
      where: { id },
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

    return NextResponse.json({ success: true, staff: updated }, { status: 200 });
  } catch (err) {
    console.error("❌ PUT /staff/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "خطا در ویرایش پرسنل" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/staff/[id]
 * حذف پرسنل
 */
export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "شناسه نامعتبر است" },
        { status: 400 }
      );
    }

    await prisma.staff.delete({ where: { id } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("❌ DELETE /staff/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "خطا در حذف پرسنل" },
      { status: 500 }
    );
  }
}
