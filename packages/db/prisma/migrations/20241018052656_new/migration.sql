/*
  Warnings:

  - You are about to drop the `Validity` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Validity" DROP CONSTRAINT "Validity_userId_fkey";

-- DropTable
DROP TABLE "Validity";
