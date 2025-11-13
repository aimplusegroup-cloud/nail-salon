// src/lib/auth.ts
import jwt from "jsonwebtoken";

export interface UserPayload {
  id: string | number; // کاربر: String (cuid)، مدیر: number (Int)
  email?: string;
  phone?: string;
  name?: string;
  role?: "admin" | "user";
  provider?: string;
}

export function getUserFromRequest(req: Request): UserPayload | null {
  const cookie = req.headers.get("cookie") || "";

  const matchUser = cookie.match(/user_token=([^;]+)/);
  const matchAdmin = cookie.match(/admin_token=([^;]+)/);

  const token = matchAdmin?.[1] || matchUser?.[1];
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
  } catch {
    return null;
  }
}
