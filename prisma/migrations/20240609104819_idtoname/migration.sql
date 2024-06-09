/*
  Warnings:

  - You are about to drop the column `userId` on the `Question` table. All the data in the column will be lost.
  - The primary key for the `QuestionAttempt` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `QuestionAttempt` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `QuestionAttempt` table. All the data in the column will be lost.
  - The primary key for the `QuizAttempt` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `QuizAttempt` table. All the data in the column will be lost.
  - The primary key for the `StudyRoomMember` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `StudyRoomMember` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `username` to the `QuestionAttempt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `QuizAttempt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `StudyRoomMember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_userId_fkey";

-- DropForeignKey
ALTER TABLE "QuestionAttempt" DROP CONSTRAINT "QuestionAttempt_studyRoom_id_quizId_user_id_day_fkey";

-- DropForeignKey
ALTER TABLE "QuestionAttempt" DROP CONSTRAINT "QuestionAttempt_userId_fkey";

-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "QuizAttempt" DROP CONSTRAINT "QuizAttempt_userId_fkey";

-- DropForeignKey
ALTER TABLE "StudyRoom" DROP CONSTRAINT "StudyRoom_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "StudyRoomContent" DROP CONSTRAINT "StudyRoomContent_creator_id_fkey";

-- DropForeignKey
ALTER TABLE "StudyRoomMember" DROP CONSTRAINT "StudyRoomMember_user_id_fkey";

-- DropForeignKey
ALTER TABLE "StudyRoomQuiz" DROP CONSTRAINT "StudyRoomQuiz_creator_id_fkey";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "userId",
ADD COLUMN     "username" TEXT;

-- AlterTable
ALTER TABLE "QuestionAttempt" DROP CONSTRAINT "QuestionAttempt_pkey",
DROP COLUMN "userId",
DROP COLUMN "user_id",
ADD COLUMN     "username" TEXT NOT NULL,
ADD CONSTRAINT "QuestionAttempt_pkey" PRIMARY KEY ("studyRoom_id", "quizId", "username", "questionId", "day");

-- AlterTable
ALTER TABLE "Quiz" ALTER COLUMN "owner_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "QuizAttempt" DROP CONSTRAINT "QuizAttempt_pkey",
DROP COLUMN "userId",
ADD COLUMN     "username" TEXT NOT NULL,
ADD CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("studyRoom_id", "quizId", "username", "day");

-- AlterTable
ALTER TABLE "StudyRoom" ALTER COLUMN "ownerId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "StudyRoomContent" ALTER COLUMN "creator_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "StudyRoomMember" DROP CONSTRAINT "StudyRoomMember_pkey",
DROP COLUMN "user_id",
ADD COLUMN     "username" TEXT NOT NULL,
ADD CONSTRAINT "StudyRoomMember_pkey" PRIMARY KEY ("username", "studyRoom_id");

-- AlterTable
ALTER TABLE "StudyRoomQuiz" ALTER COLUMN "creator_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
DROP COLUMN "name",
ADD COLUMN     "username" TEXT NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("username");

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyRoom" ADD CONSTRAINT "StudyRoom_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyRoomMember" ADD CONSTRAINT "StudyRoomMember_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyRoomQuiz" ADD CONSTRAINT "StudyRoomQuiz_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyRoomContent" ADD CONSTRAINT "StudyRoomContent_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionAttempt" ADD CONSTRAINT "QuestionAttempt_studyRoom_id_quizId_username_day_fkey" FOREIGN KEY ("studyRoom_id", "quizId", "username", "day") REFERENCES "QuizAttempt"("studyRoom_id", "quizId", "username", "day") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionAttempt" ADD CONSTRAINT "QuestionAttempt_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;
