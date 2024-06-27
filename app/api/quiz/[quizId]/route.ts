import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, context: any) {
  try {
    const { quizId } = context.params;
    if (!quizId) {
      return NextResponse.json(
        { message: "no quizId provided" },
        { status: 404 }
      );
    }
    const quiz = await prisma.quiz.findUnique({
      where: {
        id: quizId,
      },
      include: {
        questions: {
          include: {
            question: {
              include: {
                QuestionTopic: {
                  include: {
                    topic: true,
                  },
                },
              },
            },
          },
        },
        topics: {
          include: {
            topic: true,
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ message: "no quiz exists" }, { status: 404 });
    }

    const quizSend = {
      id: quiz.id,
      questions: quiz.questions.map((question, index) => {
        return {
          index: question.index,
          id: question.questionId,
          question: question.question.question,
          options: question.question.options.map((option) => {
            return {
              text: option,
              isCorrect: question.question.correctOption.includes(option),
            };
          }),

          correctOption: question.question.correctOption,
          type: question.question.type,
          tags: question.question.QuestionTopic.map((questionTopic) => {
            return questionTopic.topic;
          }),
        };
      }),
      topics: quiz.topics.map((topic) => {
        topic.topic;
      }),
    };
    return NextResponse.json({ quiz: quizSend }, { status: 200 });
  } catch (error) {
    console.error("Error getting quiz:", error);
    return NextResponse.json(
      { message: "error sending quiz" },
      { status: 404 }
    );
  }
}
