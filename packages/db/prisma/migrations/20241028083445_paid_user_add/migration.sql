/*
  Warnings:

  - You are about to drop the column `content` on the `Resume` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('FREE', 'PAID');

-- DropIndex
DROP INDEX "Resume_userId_idx";

-- AlterTable
ALTER TABLE "Resume" DROP COLUMN "content";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'FREE';
