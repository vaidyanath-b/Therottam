-- AlterTable
ALTER TABLE "StudyRoomMember" ADD COLUMN     "quizCompleted" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "quizScore" INTEGER NOT NULL DEFAULT 0;
