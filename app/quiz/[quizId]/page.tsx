"use client"
import { QuizCreate } from "@/components/component/quiz-create";
import { useParams } from "next/navigation";
import { useEffect } from "react";


export default function QuizCreatePage(){

    const params = useParams();
    useEffect(() => {
        document.title = "Edit Quiz";
    }
    , []);

    return (
        QuizCreate()
    );
} 