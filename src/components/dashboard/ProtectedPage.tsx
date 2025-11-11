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

  if (!token) {
    redirect("/dashboard/login");
  }

  try {
    const admin = jwt.verify(token!, process.env.JWT_SECRET!) as AdminPayload;
    return <>{children(admin)}</>;
  } catch {
    redirect("/dashboard/login");
  }
}
