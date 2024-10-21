/*
  Warnings:

  - You are about to drop the `TechSkill` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TechSkill" DROP CONSTRAINT "TechSkill_resumeId_fkey";

-- AlterTable
ALTER TABLE "Education" ADD COLUMN     "score" DOUBLE PRECISION;

-- DropTable
DROP TABLE "TechSkill";
