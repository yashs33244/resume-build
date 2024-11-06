/*
  Warnings:

  - You are about to drop the column `downloadCount` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `ResumeDraft` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ResumeDraft" DROP CONSTRAINT "ResumeDraft_resumeId_fkey";

-- DropForeignKey
ALTER TABLE "ResumeDraft" DROP CONSTRAINT "ResumeDraft_userId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_userId_fkey";

-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "content" JSONB,
ALTER COLUMN "createdAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "downloadCount";

-- DropTable
DROP TABLE "ResumeDraft";

-- DropTable
DROP TABLE "Subscription";

-- DropEnum
DROP TYPE "SubscriptionPlan";

-- DropEnum
DROP TYPE "SubscriptionStatus";

-- CreateIndex
CREATE INDEX "Resume_userId_idx" ON "Resume"("userId");
