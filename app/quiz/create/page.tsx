import { QuizCreate } from "@/components/component/quiz-create";
import { prisma } from "@/lib/prisma";
import { GetServerSideProps } from "next";
import { redirect, useRouter } from "next/navigation";
interface Props {
    quiz: Quiz;
}
interface Quiz {
    id: string;
}
async function getQuizID() {
    const quiz = await prisma.quiz.create({});
    console.log("Quiz created" , quiz.id)
    return quiz;
}

export default async function QuizCreatePage() {
    const quiz = await getQuizID();
    redirect(`/quiz/create/${quiz.id}`)
}
