import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

export interface AdminPayload {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}

export default async function ProtectedPage({
  children,
}: {
  children: (admin: AdminPayload) => React.ReactNode;
}) {
  const token = (await cookies()).get("admin_token")?.value;

  // اگر کوکی وجود نداشت → ریدایرکت به لاگین
  if (!token) {
    redirect("/dashboard/login");
  }

  try {
    const admin = jwt.verify(token!, process.env.JWT_SECRET!) as AdminPayload;

    // اگر توکن معتبر بود → children با اطلاعات مدیر
    return <>{children(admin)}</>;
  } catch {
    // اگر توکن نامعتبر یا منقضی شده بود → ریدایرکت به لاگین
    redirect("/dashboard/login");
  }
}
