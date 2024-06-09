/**
 * v0 by Vercel.
 * @see https://v0.dev/t/M1EJsilNUm5
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { QuizCreate } from "./quiz-create"
import Modules from "./createSolvable"

export default function CreateDay() {
  const [activeTab, setActiveTab] = useState("quiz")
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    type: "multiple-choice",
    options: [{ text: "", isCorrect: false }],
  })
  
  return (
    <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
        <TabsTrigger value="quiz">Quiz</TabsTrigger>
        <TabsTrigger value="questions">Questions</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="quiz">
        <QuizCreate />
      </TabsContent>
      <TabsContent value="settings">
        <Modules />
      </TabsContent>
    </Tabs>
  )
}