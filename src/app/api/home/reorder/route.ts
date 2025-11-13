import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, order } = body;

    if (!id || typeof order !== "number") {
      return NextResponse.json(
        { success: false, message: "شناسه و ترتیب معتبر نیست" },
        { status: 400 }
      );
    }

    const updated = await prisma.homeContent.update({
      where: { id },
      data: { order },
    });

    return NextResponse.json({ success: true, item: updated }, { status: 200 });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : String(err);
    console.error("❌ POST /home/reorder error:", error);
    return NextResponse.json(
      { success: false, message: "خطا در تغییر ترتیب", error },
      { status: 500 }
    );
  }
}
