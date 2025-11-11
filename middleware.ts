import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const pathname = url.pathname;

  // اجازه عبور به صفحه‌های لاگین و فراموشی رمز
  if (pathname === "/dashboard/login" || pathname === "/dashboard/forgot") {
    console.log("⏩ Skip middleware for:", pathname);
    return NextResponse.next();
  }

  // گرفتن کوکی
  const token = req.cookies.get("admin_token")?.value;
  console.log(
    "🔑 TOKEN FROM COOKIE:",
    token ? token.slice(0, 25) + "..." : "NO TOKEN"
  );

  if (!token) {
    console.log("❌ No token found → redirect to /dashboard/login");
    return NextResponse.redirect(new URL("/dashboard/login", req.url));
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("Missing JWT_SECRET");

    // استفاده از JwtPayload برای تایپ دقیق
    const decoded = jwt.verify(token, secret) as JwtPayload & {
      provider?: string;
    };

    console.log("✅ JWT VERIFIED:", decoded);

    // اگر بخواهی provider را هم بررسی کنی:
    if (decoded.provider) {
      console.log("🔹 Login provider:", decoded.provider);
    }

    return NextResponse.next();
  } catch (err) {
    console.error("❌ JWT VERIFY ERROR:", err);
    return NextResponse.redirect(new URL("/dashboard/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
