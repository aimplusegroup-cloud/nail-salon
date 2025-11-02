/*
  Warnings:

  - You are about to drop the column `maxCommission` on the `Staff` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Staff" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "bio" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "role" TEXT,
    "skills" TEXT,
    "avatarUrl" TEXT,
    "employmentType" TEXT NOT NULL DEFAULT 'FULLTIME',
    "baseSalary" INTEGER,
    "commission" REAL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Staff" ("active", "avatarUrl", "baseSalary", "bio", "commission", "createdAt", "email", "employmentType", "id", "name", "phone", "role", "skills", "updatedAt") SELECT "active", "avatarUrl", "baseSalary", "bio", "commission", "createdAt", "email", "employmentType", "id", "name", "phone", "role", "skills", "updatedAt" FROM "Staff";
DROP TABLE "Staff";
ALTER TABLE "new_Staff" RENAME TO "Staff";
CREATE UNIQUE INDEX "Staff_phone_key" ON "Staff"("phone");
CREATE UNIQUE INDEX "Staff_email_key" ON "Staff"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
