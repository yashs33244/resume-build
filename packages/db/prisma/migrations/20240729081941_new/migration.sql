/*
  Warnings:

  - You are about to drop the column `category` on the `Skill` table. All the data in the column will be lost.
  - Added the required column `name` to the `Skill` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Skill" DROP COLUMN "category",
ADD COLUMN     "name" TEXT NOT NULL;
