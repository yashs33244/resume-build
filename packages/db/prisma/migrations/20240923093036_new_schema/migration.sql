/*
  Warnings:

  - The values [NOT_DONE_YET,SUCCESS,FAILED] on the enum `ResumeState` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `years` on the `Education` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Experience` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Project` table. All the data in the column will be lost.
  - Added the required column `end` to the `Education` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start` to the `Education` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end` to the `Experience` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start` to the `Experience` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `link` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ResumeState_new" AS ENUM ('NOT_STARTED', 'EDITING', 'COMPLETED', 'DOWNLOADING', 'DOWNLOAD_SUCCESS', 'DOWNLOAD_FAILED');
ALTER TABLE "Resume" ALTER COLUMN "state" DROP DEFAULT;
ALTER TABLE "Resume" ALTER COLUMN "state" TYPE "ResumeState_new" USING ("state"::text::"ResumeState_new");
ALTER TYPE "ResumeState" RENAME TO "ResumeState_old";
ALTER TYPE "ResumeState_new" RENAME TO "ResumeState";
DROP TYPE "ResumeState_old";
ALTER TABLE "Resume" ALTER COLUMN "state" SET DEFAULT 'NOT_STARTED';
COMMIT;

-- AlterTable
ALTER TABLE "Education" DROP COLUMN "years",
ADD COLUMN     "end" TEXT NOT NULL,
ADD COLUMN     "start" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Experience" DROP COLUMN "duration",
ADD COLUMN     "end" TEXT NOT NULL,
ADD COLUMN     "start" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PersonalInfo" ADD COLUMN     "linkedin" TEXT;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "description",
DROP COLUMN "duration",
ADD COLUMN     "end" TEXT NOT NULL,
ADD COLUMN     "link" TEXT NOT NULL,
ADD COLUMN     "responsibilities" TEXT[],
ADD COLUMN     "start" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Resume" ALTER COLUMN "state" SET DEFAULT 'NOT_STARTED';

-- CreateTable
CREATE TABLE "CoreSkill" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CoreSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechSkill" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TechSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "issuedOn" TEXT NOT NULL,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CoreSkill" ADD CONSTRAINT "CoreSkill_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechSkill" ADD CONSTRAINT "TechSkill_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Language" ADD CONSTRAINT "Language_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;
