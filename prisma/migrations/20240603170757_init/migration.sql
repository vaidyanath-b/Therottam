-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER');

-- CreateTable
CREATE TABLE "Quiz" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" "QuestionType" NOT NULL,
    "options" TEXT[],
    "correctOption" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizQuestion" (
    "quizId" UUID NOT NULL,
    "questionId" UUID NOT NULL,

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
