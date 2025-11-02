-- AlterTable
ALTER TABLE "Admin" ADD COLUMN "resetToken" TEXT;
ALTER TABLE "Admin" ADD COLUMN "resetTokenExpiry" DATETIME;
