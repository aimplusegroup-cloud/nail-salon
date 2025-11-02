// app/api/admin/logout/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return clearCookieAndRedirect();
}

export async function POST() {
  return clearCookieAndRedirect();
}

function clearCookieAndRedirect() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const response = NextResponse.redirect(new URL("/dashboard/login", baseUrl));

  // دقیقاً همان تنظیمات Login
  response.cookies.set("admin_token", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",            // باید یکی باشه
    expires: new Date(0), // حذف فوری
  });

  return response;
}
