import { PrismaClient } from "@prisma/client";

// تعریف یک متغیر global برای جلوگیری از ساخت چندباره PrismaClient در حالت dev
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// ایجاد singleton
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"] // در حالت dev لاگ کامل‌تر
        : ["error"], // در production فقط خطاها
  });

// در حالت development، PrismaClient را در global ذخیره می‌کنیم
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
