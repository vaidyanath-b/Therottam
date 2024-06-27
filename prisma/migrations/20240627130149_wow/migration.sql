/*
  Warnings:

  - The primary key for the `QuestionAttempt` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `day` on the `QuestionAttempt` table. All the data in the column will be lost.
  - You are about to drop the column `quizId` on the `QuestionAttempt` table. All the data in the column will be lost.
  - You are about to drop the column `studyRoom_id` on the `QuestionAttempt` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `QuestionAttempt` table. All the data in the column will be lost.
  - The primary key for the `QuizAttempt` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[studyRoom_id,quizId,username,day,attemptId]` on the table `QuizAttempt` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "QuestionAttempt" DROP CONSTRAINT "QuestionAttempt_attemptId_studyRoom_id_quizId_username_day_fkey";

-- DropForeignKey
ALTER TABLE "QuestionAttempt" DROP CONSTRAINT "QuestionAttempt_username_fkey";

-- AlterTable
ALTER TABLE "QuestionAttempt" DROP CONSTRAINT "QuestionAttempt_pkey",
DROP COLUMN "day",
DROP COLUMN "quizId",
DROP COLUMN "studyRoom_id",
DROP COLUMN "username",
ADD COLUMN     "userUsername" TEXT,
ADD CONSTRAINT "QuestionAttempt_pkey" PRIMARY KEY ("attemptId", "questionId");

-- AlterTable
ALTER TABLE "QuizAttempt" DROP CONSTRAINT "QuizAttempt_pkey",
ADD CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("attemptId");

-- CreateIndex
CREATE UNIQUE INDEX "QuizAttempt_studyRoom_id_quizId_username_day_attemptId_key" ON "QuizAttempt"("studyRoom_id", "quizId", "username", "day", "attemptId");

-- AddForeignKey
ALTER TABLE "QuestionAttempt" ADD CONSTRAINT "QuestionAttempt_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "QuizAttempt"("attemptId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionAttempt" ADD CONSTRAINT "QuestionAttempt_userUsername_fkey" FOREIGN KEY ("userUsername") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;
