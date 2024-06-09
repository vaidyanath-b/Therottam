/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `StudyRoom` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `StudyRoom` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StudyRoom" ADD COLUMN     "code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "StudyRoom_code_key" ON "StudyRoom"("code");
