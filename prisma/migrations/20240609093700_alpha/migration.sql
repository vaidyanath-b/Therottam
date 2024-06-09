-- CreateEnum
CREATE TYPE "difficulty_type" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "userId" UUID;

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "owner_id" UUID,
ADD COLUMN     "studyRoomId" UUID;

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudyRoom" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "ownerId" UUID NOT NULL,

    CONSTRAINT "StudyRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudyRoomMember" (
    "user_id" UUID NOT NULL,
    "studyRoom_id" UUID NOT NULL,

    CONSTRAINT "StudyRoomMember_pkey" PRIMARY KEY ("user_id","studyRoom_id")
);

-- CreateTable
CREATE TABLE "StudyRoomQuiz" (
    "day" INTEGER NOT NULL,
    "studyRoom_id" UUID NOT NULL,
    "quizId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creator_id" UUID NOT NULL,

    CONSTRAINT "StudyRoomQuiz_pkey" PRIMARY KEY ("studyRoom_id","quizId","day")
);

-- CreateTable
CREATE TABLE "StudyRoomContent" (
    "id" SERIAL NOT NULL,
    "day" INTEGER NOT NULL,
    "studyRoom_id" UUID NOT NULL,
    "difficulty" "difficulty_type" NOT NULL,
    "title" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "creator_id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "topic_id" UUID NOT NULL,

    CONSTRAINT "StudyRoomContent_pkey" PRIMARY KEY ("studyRoom_id","day","id")
);

-- CreateTable
CREATE TABLE "QuizAttempt" (
    "studyRoom_id" UUID NOT NULL,
    "day" INTEGER NOT NULL,
    "quizId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "score" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("studyRoom_id","quizId","userId","day")
);

-- CreateTable
CREATE TABLE "QuestionAttempt" (
    "user_id" UUID NOT NULL,
    "questionId" UUID NOT NULL,
    "studyRoom_id" UUID NOT NULL,
    "quizId" UUID NOT NULL,
    "day" INTEGER NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "answer" TEXT NOT NULL,
    "userId" UUID,

    CONSTRAINT "QuestionAttempt_pkey" PRIMARY KEY ("studyRoom_id","quizId","user_id","questionId","day")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_studyRoomId_fkey" FOREIGN KEY ("studyRoomId") REFERENCES "StudyRoom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyRoom" ADD CONSTRAINT "StudyRoom_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyRoomMember" ADD CONSTRAINT "StudyRoomMember_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyRoomMember" ADD CONSTRAINT "StudyRoomMember_studyRoom_id_fkey" FOREIGN KEY ("studyRoom_id") REFERENCES "StudyRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyRoomQuiz" ADD CONSTRAINT "StudyRoomQuiz_studyRoom_id_fkey" FOREIGN KEY ("studyRoom_id") REFERENCES "StudyRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyRoomQuiz" ADD CONSTRAINT "StudyRoomQuiz_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyRoomQuiz" ADD CONSTRAINT "StudyRoomQuiz_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyRoomContent" ADD CONSTRAINT "StudyRoomContent_studyRoom_id_fkey" FOREIGN KEY ("studyRoom_id") REFERENCES "StudyRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyRoomContent" ADD CONSTRAINT "StudyRoomContent_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyRoomContent" ADD CONSTRAINT "StudyRoomContent_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_studyRoom_id_fkey" FOREIGN KEY ("studyRoom_id") REFERENCES "StudyRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionAttempt" ADD CONSTRAINT "QuestionAttempt_studyRoom_id_quizId_user_id_day_fkey" FOREIGN KEY ("studyRoom_id", "quizId", "user_id", "day") REFERENCES "QuizAttempt"("studyRoom_id", "quizId", "userId", "day") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionAttempt" ADD CONSTRAINT "QuestionAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
