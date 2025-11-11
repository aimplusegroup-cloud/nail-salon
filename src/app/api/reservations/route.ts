import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendSMS } from "@/lib/smsClient";
import jwt, { JwtPayload } from "jsonwebtoken";

const WORK_START_HOUR = 10;
const WORK_END_HOUR = 20;

interface UserPayload extends JwtPayload {
  id: string;
  phone?: string;
}

function getUserFromRequest(req: Request): UserPayload | null {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/user_token=([^;]+)/);
  if (!match) return null;

  try {
    return jwt.verify(match[1], process.env.JWT_SECRET!) as UserPayload;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: true, service: true, staff: true },
    });

    return NextResponse.json(
      reservations.map((r) => ({
        id: r.id,
        status: r.status,
        user: { name: r.user?.name, phone: r.user?.phone },
        service: { id: r.service?.id, name: r.service?.name },
        staff: { id: r.staff?.id, name: r.staff?.name },
        startsAt: r.startsAt,
        endsAt: r.endsAt,
        createdAt: r.createdAt.toISOString(),
        notes: r.notes,
      }))
    );
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : String(err);
    console.error("❌ GET /reservations error:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "برای ثبت رزرو باید وارد شوید" },
        { status: 401 }
      );
    }

    const data = await req.json();
    const { serviceId, staffId, date, time, notes } = data || {};

    if (!serviceId || !staffId || !date || !time) {
      return NextResponse.json(
        { success: false, error: "فیلدهای ضروری ناقص است" },
        { status: 400 }
      );
    }

    // بررسی ساعت کاری
    const [hourStr] = time.split(":");
    const hour = parseInt(hourStr, 10);
    if (isNaN(hour) || hour < WORK_START_HOUR || hour >= WORK_END_HOUR) {
      return NextResponse.json(
        { success: false, error: "ساعت انتخابی خارج از ساعت کاری است" },
        { status: 400 }
      );
    }

    // بررسی سرویس
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) {
      return NextResponse.json(
        { success: false, error: "خدمت انتخابی معتبر نیست" },
        { status: 400 }
      );
    }

    // محاسبه زمان پایان
    const [h, m] = time.split(":").map((x: string) => parseInt(x, 10));
    // یا می‌توانی بنویسی: const [h, m] = time.split(":").map(Number);

    const startDate = new Date();
    startDate.setHours(h, m, 0, 0);
    const endDate = new Date(startDate.getTime() + service.durationMin * 60000);

    const startsAt = `${date} ${time}`;
    const endsAt = `${date} ${endDate.getHours().toString().padStart(2, "0")}:${endDate
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    // رزرو
    const reservation = await prisma.reservation.create({
      data: {
        serviceId,
        staffId,
        userId: user.id,
        startsAt,
        endsAt,
        status: "PENDING",
        notes,
      },
      include: { user: true, service: true, staff: true },
    });

    // ارسال SMS
    try {
      if (user.phone) {
        await sendSMS(
          user.phone,
          `رزرو شما برای ${service.name} در تاریخ ${date} ساعت ${time} ثبت شد.`
        );
      }
    } catch (smsErr: unknown) {
      const error = smsErr instanceof Error ? smsErr.message : String(smsErr);
      console.error("⚠️ SMS sending error:", error);
    }

    return NextResponse.json(
      { success: true, message: "رزرو با موفقیت ثبت شد", reservation },
      { status: 201 }
    );
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : String(err);
    console.error("❌ POST /reservations error:", error);
    return NextResponse.json(
      { success: false, error: "خطای داخلی سرور", detail: error },
      { status: 500 }
    );
  }
}
