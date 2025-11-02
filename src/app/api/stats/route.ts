import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // تعداد کل رزروها
    const totalReservations = await prisma.reservation.count();

    // رزروهای تأییدشده و لغوشده
    const confirmed = await prisma.reservation.count({
      where: { status: "CONFIRMED" },
    });
    const canceled = await prisma.reservation.count({
      where: { status: "CANCELED" },
    });

    // درآمد کل (جمع قیمت خدمات رزروهای تأییدشده)
    const revenueAgg = await prisma.reservation.findMany({
      where: { status: "CONFIRMED" },
      include: { service: true },
    });
    const revenue = revenueAgg.reduce(
      (sum, r) => sum + (r.service?.price || 0),
      0
    );

    // کاربران جدید (۳۰ روز اخیر)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newCustomers = await prisma.user.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    });

    // نرخ بازگشت کاربران (کسانی که بیش از یک رزرو دارند)
    const repeatCustomers = await prisma.user.count({
      where: {
        reservations: {
          some: { status: "CONFIRMED" },
        },
      },
    });
    const totalCustomers = await prisma.user.count();
    const retentionRate =
      totalCustomers > 0
        ? Math.round((repeatCustomers / totalCustomers) * 100)
        : 0;

    // میانگین امتیاز رضایت (در schema فعلی نداریم → null)
    const avgRating = null;

    return NextResponse.json({
      totalReservations,
      confirmed,
      canceled,
      revenue,
      newCustomers,   // 👈 اسم قبلی حفظ شد
      retentionRate,
      avgRating,
    });
  } catch (err) {
    console.error("GET /stats error:", err);
    return NextResponse.json(
      {
        totalReservations: 0,
        confirmed: 0,
        canceled: 0,
        revenue: 0,
        newCustomers: 0,
        retentionRate: 0,
        avgRating: null,
      },
      { status: 500 }
    );
  }
}
