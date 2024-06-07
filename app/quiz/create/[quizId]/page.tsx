"use client"
import { QuizCreate } from "@/components/component/quiz-create";
import { useParams } from "next/navigation";
import { useEffect } from "react";


export default function QuizCreatePage(){

    const params = useParams();
    const quizId= params.quizId as string;
    useEffect(() => {
        document.title = "Edit Quiz";
    }
    , []);

    return (
        QuizCreate()
    );
} 