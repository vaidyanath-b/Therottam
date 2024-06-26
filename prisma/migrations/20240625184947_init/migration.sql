-- CreateEnum
CREATE TYPE "difficulty_type" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER');

-- CreateTable
CREATE TABLE "User" (
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "Quiz" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "owner_id" TEXT,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudyRoom" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "StudyRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudyRoomMember" (
    "username" TEXT NOT NULL,
    "studyRoom_id" UUID NOT NULL,
    "lastCreatedQuizDay" INTEGER NOT NULL DEFAULT -1,
    "lastCreatedContentDay" INTEGER NOT NULL DEFAULT -1,
    "quizesCreated" INTEGER NOT NULL DEFAULT 0,
    "contentCreated" INTEGER NOT NULL DEFAULT 0,
    "quizes_won" INTEGER NOT NULL DEFAULT 0,
    "contents_completed" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "StudyRoomMember_pkey" PRIMARY KEY ("username","studyRoom_id")
);

-- CreateTable
CREATE TABLE "StudyRoomDay" (
    "room_id" UUID NOT NULL,
    "day" INTEGER NOT NULL,
    "scheduled_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudyRoomDay_pkey" PRIMARY KEY ("room_id","day")
);

-- CreateTable
CREATE TABLE "StudyRoomQuiz" (
    "day" INTEGER NOT NULL,
    "studyRoom_id" UUID NOT NULL,
    "quizId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creator_id" TEXT,

    CONSTRAINT "StudyRoomQuiz_pkey" PRIMARY KEY ("studyRoom_id","quizId","day")
);

-- CreateTable
CREATE TABLE "StudyRoomContent" (
    "id" SERIAL NOT NULL,
    "day" INTEGER NOT NULL,
    "studyRoom_id" UUID NOT NULL,
    "difficulty" "difficulty_type",
    "title" TEXT,
    "activity" TEXT,
    "resource" TEXT,
    "creator_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "topic_id" UUID,
    "date" TIMESTAMP(3),
    "isLive" BOOLEAN NOT NULL DEFAULT false,
    "scheduled_date" TIMESTAMP(3),

    CONSTRAINT "StudyRoomContent_pkey" PRIMARY KEY ("studyRoom_id","day","id")
);

-- CreateTable
CREATE TABLE "QuizAttempt" (
    "studyRoom_id" UUID NOT NULL,
    "day" INTEGER NOT NULL,
    "quizId" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("studyRoom_id","quizId","username","day")
);

-- CreateTable
CREATE TABLE "QuestionAttempt" (
    "username" TEXT NOT NULL,
    "questionId" UUID NOT NULL,
    "studyRoom_id" UUID NOT NULL,
    "quizId" UUID NOT NULL,
    "day" INTEGER NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "QuestionAttempt_pkey" PRIMARY KEY ("studyRoom_id","quizId","username","questionId","day")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" "QuestionType" NOT NULL,
    "question" TEXT NOT NULL,
    "options" TEXT[],
    "correctOption" TEXT[],
    "username" TEXT,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizQuestion" (
    "quizId" UUID NOT NULL,
    "questionId" UUID NOT NULL,
    "index" INTEGER,

    CONSTRAINT "QuizQuestion_pkey" PRIMARY KEY ("quizId","questionId")
);

-- CreateTable
CREATE TABLE "QuestionTopic" (
    "questionId" UUID NOT NULL,
    "topicId" UUID NOT NULL,

    CONSTRAINT "QuestionTopic_pkey" PRIMARY KEY ("questionId","topicId")
);

-- CreateTable
CREATE TABLE "QuizTopic" (
    "quizId" UUID NOT NULL,
    "topicId" UUID NOT NULL,

    CONSTRAINT "QuizTopic_pkey" PRIMARY KEY ("quizId","topicId")
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "StudyRoom_code_key" ON "StudyRoom"("code");

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyRoom" ADD CONSTRAINT "StudyRoom_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyRoomMember" ADD CONSTRAINT "StudyRoomMember_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyRoomMember" ADD CONSTRAINT "StudyRoomMember_studyRoom_id_fkey" FOREIGN KEY ("studyRoom_id") REFERENCES "StudyRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyRoomDay" ADD CONSTRAINT "StudyRoomDay_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "StudyRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyRoomQuiz" ADD CONSTRAINT "StudyRoomQuiz_studyRoom_id_fkey" FOREIGN KEY ("studyRoom_id") REFERENCES "StudyRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyRoomQuiz" ADD CONSTRAINT "StudyRoomQuiz_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyRoomQuiz" ADD CONSTRAINT "StudyRoomQuiz_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyRoomQuiz" ADD CONSTRAINT "StudyRoomQuiz_studyRoom_id_day_fkey" FOREIGN KEY ("studyRoom_id", "day") REFERENCES "StudyRoomDay"("room_id", "day") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyRoomContent" ADD CONSTRAINT "StudyRoomContent_studyRoom_id_fkey" FOREIGN KEY ("studyRoom_id") REFERENCES "StudyRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyRoomContent" ADD CONSTRAINT "StudyRoomContent_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyRoomContent" ADD CONSTRAINT "StudyRoomContent_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyRoomContent" ADD CONSTRAINT "StudyRoomContent_studyRoom_id_day_fkey" FOREIGN KEY ("studyRoom_id", "day") REFERENCES "StudyRoomDay"("room_id", "day") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_studyRoom_id_fkey" FOREIGN KEY ("studyRoom_id") REFERENCES "StudyRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionAttempt" ADD CONSTRAINT "QuestionAttempt_studyRoom_id_quizId_username_day_fkey" FOREIGN KEY ("studyRoom_id", "quizId", "username", "day") REFERENCES "QuizAttempt"("studyRoom_id", "quizId", "username", "day") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionAttempt" ADD CONSTRAINT "QuestionAttempt_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizQuestion" ADD CONSTRAINT "QuizQuestion_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizQuestion" ADD CONSTRAINT "QuizQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionTopic" ADD CONSTRAINT "QuestionTopic_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionTopic" ADD CONSTRAINT "QuestionTopic_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizTopic" ADD CONSTRAINT "QuizTopic_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizTopic" ADD CONSTRAINT "QuizTopic_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
