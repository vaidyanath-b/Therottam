/**
 * v0 by Vercel.
 * @see https://v0.dev/t/Yn2tQFG2yTR
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function Component() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const questions = [
    {
      id: 1,
      question: "What is the capital of France?",
      answers: ["Paris", "London", "Berlin", "Madrid"],
      correctAnswer: 0,
    },
    {
      id: 2,
      question: "What is the largest ocean in the world?",
      answers: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
      correctAnswer: 3,
    },
    {
      id: 3,
      question: "Who painted the Mona Lisa?",
      answers: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
      correctAnswer: 2,
    },
    {
      id: 4,
      question: "What is the smallest planet in our solar system?",
      answers: ["Venus", "Mars", "Mercury", "Earth"],
      correctAnswer: 2,
    },
    {
      id: 5,
      question: "What is the largest mammal on Earth?",
      answers: ["Elephant", "Giraffe", "Blue Whale", "Hippopotamus"],
      correctAnswer: 2,
    },
  ]
  const handleAnswerSelect = (questionId, answerIndex) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answerIndex,
    }))
  }
  const handleSubmit = () => {
    setIsSubmitted(true)
  }
  const calculateScore = () => {
    let score = 0
    questions.forEach((question, index) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        score++
      }
    })
    return score
  }
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8 px-4 md:px-6 lg:px-8">
      <div className="w-full max-w-3xl">
        <h1 className="mb-2 text-3xl font-bold">Quiz</h1>
        <p className="mb-8 text-gray-500 dark:text-gray-400">Answer the following questions to test your knowledge.</p>
        <div className="grid grid-cols-[300px_1fr] gap-8">
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
            <h2 className="mb-4 text-lg font-semibold">Questions</h2>
            <div className="grid grid-cols-2 gap-2">
              {questions.map((question, index) => (
                <button
                  key={question.id}
                  onClick={() => setCurrentQuestion(index)}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    currentQuestion === index
                      ? "bg-gray-900 text-white dark:bg-gray-50 dark:text-gray-900"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {question.id}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
              <h2 className="mb-2 text-lg font-semibold">{questions[currentQuestion].question}</h2>
              <div className="space-y-2">
                {questions[currentQuestion].answers.map((answer, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="radio"
                      id={`answer-${index}`}
                      name={`question-${questions[currentQuestion].id}`}
                      checked={selectedAnswers[questions[currentQuestion].id] === index}
                      onChange={() => handleAnswerSelect(questions[currentQuestion].id, index)}
                      className="h-4 w-4 rounded-full border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-gray-900 dark:border-gray-600 dark:bg-gray-950 dark:text-gray-50 dark:focus:ring-gray-50"
                    />
                    <label htmlFor={`answer-${index}`} className="text-gray-900 dark:text-gray-50">
                      {answer}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            {isSubmitted ? (
              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
                <h2 className="mb-2 text-lg font-semibold">
                  Your score: {calculateScore()} / {questions.length}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">Thank you for completing the quiz!</p>
              </div>
            ) : (
              <Button onClick={handleSubmit} className="w-full">
                Submit Quiz
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}