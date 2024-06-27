"use client"
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/Yn2tQFG2yTR
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useParams } from "next/navigation"
import Timer from "./timer"
import axios from "axios"
export default function AttemptQuiz() {

  const {roomId , quizId,day} = useParams()
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<any>(null);

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<any>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [questions , setQuestions] =useState<any>([
  ])
  const handleAnswerSelect = (questionId: any, answer: string, questionType: string) => {
    setSelectedAnswers((prevAnswers: any) => {
      const updatedAnswers = { ...prevAnswers };
  
      if (questionType === "TRUE_FALSE") {
        // For TRUE_FALSE questions, only one answer can be selected at a time
        updatedAnswers[questionId] = [answer];
      } else {
        // For other types, allow multiple selections
        if (updatedAnswers[questionId]?.includes(answer)) {
          // If the answer is already selected, remove it
          updatedAnswers[questionId] = updatedAnswers[questionId].filter((ans: string) => ans !== answer);
        } else {
          // Add the answer to the list, initializing the list if necessary
          updatedAnswers[questionId] = updatedAnswers[questionId] ? [...updatedAnswers[questionId], answer] : [answer];

        }
      }
  
      return updatedAnswers;
    });
  }
  const handleSubmit = async () => {
    const res = await axios.post(`/api/quizAttempt/${quizId}`, {
      attempts: selectedAnswers,
      roomId,
      day
    });
    setIsSubmitted(true);
    // Assuming res.data contains the feedback similar to the provided structure
    setFeedback(res.data.QuestionAttempt); // Store the entire feedback
    // Calculate score
    setScore(res.data.score);
  };
    useEffect(() => {
    async function getQuestions() {
      fetch(`/api/quizAttempt/${quizId}`)
        .then((res) => res.json())
        .then((data) => {
          setQuestions(data.quiz.questions)
        }) 
    }
    getQuestions()
  },[])
  return (
    questions.length!=0   &&   <div className="flex h-full w-full flex-col items-center justify-center gap-8 px-4 md:px-6 lg:px-8 p-3">
    {isSubmitted && score !== null && (
      <div className="text-xl font-bold">
        Your score: {score} / {questions.length}
      </div>
    )}

      {/* <Timer /> */}
      <div className="w-full max-w-3xl">
        <h1 className="mb-2 text-3xl font-bold">Quiz</h1>
        <p className="mb-8 text-gray-500 dark:text-gray-400">Answer the following questions to test your knowledge.</p>
        <div className="grid grid-cols-[300px_1fr] gap-8">
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
            <h2 className="mb-4 text-lg font-semibold">Questions</h2>
            <div className="grid grid-cols-2 gap-2">
              {questions.map((question:any, index:any) => (
                <button
                  key={question.id}
                  onClick={() => setCurrentQuestion(index)}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    currentQuestion === index
                      ? "bg-gray-900 text-white dark:bg-gray-50 dark:text-gray-900"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {question.index}
                </button>
              ))}
            </div>
          </div>
          <div>
          <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
  <h2 className="mb-2 text-lg font-semibold">{questions[currentQuestion].question}</h2>
  <div className="space-y-2">
  {questions[currentQuestion].options.map((answer: any, index: any) => {
      answer = answer.text;
      const isCorrect = feedback?.find((f: any) => f.questionId === questions[currentQuestion].id && f.question.correctOption.includes(answer));
      const isSelected = selectedAnswers[questions[currentQuestion].id]?.includes(answer) || false;

      return (
        <div key={index} className="flex items-center gap-2">
        {questions[currentQuestion].type === "TRUE_FALSE" ? (
          <input
            type="radio"
            id={`answer-${index}`}
            name={`question-${questions[currentQuestion].id}`}
            checked={isSelected}
            onChange={() => handleAnswerSelect(questions[currentQuestion].id, answer , questions[currentQuestion].type)}
            className={`h-4 w-4 rounded  text-gray-900 focus:ring-2 focus:ring-gray-900 dark:border-gray-600 dark:bg-gray-950 dark:text-gray-50 dark:focus:ring-gray-50`}
            disabled={isSubmitted} // Disable input after submission

            />
        ) : (
          <input
            type="checkbox"
            id={`answer-${index}`}
            name={`question-${questions[currentQuestion].id}`}
            checked={isSelected}
            onChange={() => handleAnswerSelect(questions[currentQuestion].id, answer, questions[currentQuestion].type)}
            className={`h-4 w-4 rounded text-gray-900 focus:ring-2 focus:ring-gray-900 dark:border-gray-600 dark:bg-gray-950 dark:text-gray-50 dark:focus:ring-gray-50`}
            disabled={isSubmitted} // Disable input after submission

          />
        )}
          <label htmlFor={`answer-${index}`} className={`${isSubmitted ? (isCorrect ? ( "text-green-500") : (isSelected ? "text-red-500" :"" )): "" }`}>
            {answer}
          </label>
        </div>
      );
    })}
  </div>
</div> 

            {/* {isSubmitted ? (
              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
              <h2 className="mb-2 text-lg font-semibold">
              Your score: {calculateScore()} / {questions.length}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">Thank you for completing the quiz!</p>
              </div>
              ) : (
                )} */}
          </div>
                <Button onClick={handleSubmit} className="mt-5 w-full">
                     Submit Quiz
                   </Button>
        </div>
      </div>
    </div>
  )
}