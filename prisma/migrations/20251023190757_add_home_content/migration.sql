/*
  Warnings:

  - You are about to drop the `Testimonial` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `resetToken` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `resetTokenExpiry` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `HomeContent` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `HomeContent` table. All the data in the column will be lost.
  - Made the column `imageUrl` on table `HomeContent` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Reservation_customerId_idx";

-- DropIndex
DROP INDEX "Reservation_staffId_idx";

-- DropIndex
DROP INDEX "Reservation_serviceId_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Testimonial";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Admin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Admin" ("createdAt", "email", "id", "password", "updatedAt") SELECT "createdAt", "email", "id", "password", "updatedAt" FROM "Admin";
DROP TABLE "Admin";
ALTER TABLE "new_Admin" RENAME TO "Admin";
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");
CREATE TABLE "new_HomeContent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_HomeContent" ("createdAt", "id", "imageUrl", "title", "updatedAt") SELECT "createdAt", "id", "imageUrl", "title", "updatedAt" FROM "HomeContent";
DROP TABLE "HomeContent";
ALTER TABLE "new_HomeContent" RENAME TO "HomeContent";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
