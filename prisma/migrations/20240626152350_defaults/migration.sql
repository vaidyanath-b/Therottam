/*
  Warnings:

  - The primary key for the `QuestionAttempt` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `QuizAttempt` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `attemptId` to the `QuestionAttempt` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "QuestionAttempt" DROP CONSTRAINT "QuestionAttempt_studyRoom_id_quizId_username_day_fkey";

-- AlterTable
ALTER TABLE "QuestionAttempt" DROP CONSTRAINT "QuestionAttempt_pkey",
ADD COLUMN     "attemptId" INTEGER NOT NULL,
ADD CONSTRAINT "QuestionAttempt_pkey" PRIMARY KEY ("studyRoom_id", "quizId", "username", "questionId", "day", "attemptId");

-- AlterTable
ALTER TABLE "QuizAttempt" DROP CONSTRAINT "QuizAttempt_pkey",
ADD COLUMN     "attemptId" SERIAL NOT NULL,
ADD CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("studyRoom_id", "quizId", "username", "day", "attemptId");

-- AddForeignKey
ALTER TABLE "QuestionAttempt" ADD CONSTRAINT "QuestionAttempt_attemptId_studyRoom_id_quizId_username_day_fkey" FOREIGN KEY ("attemptId", "studyRoom_id", "quizId", "username", "day") REFERENCES "QuizAttempt"("attemptId", "studyRoom_id", "quizId", "username", "day") ON DELETE RESTRICT ON UPDATE CASCADE;
