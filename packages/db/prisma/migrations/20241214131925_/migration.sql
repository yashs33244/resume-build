-- DropForeignKey
ALTER TABLE "PersonalInfo" DROP CONSTRAINT "PersonalInfo_resumeId_fkey";

-- DropIndex
DROP INDEX "PersonalInfo_resumeId_key";

-- AddForeignKey
ALTER TABLE "PersonalInfo" ADD CONSTRAINT "PersonalInfo_id_fkey" FOREIGN KEY ("id") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;
