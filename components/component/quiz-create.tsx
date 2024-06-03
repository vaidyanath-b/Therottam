import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import MultiSelect from "./Multiselect";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faCheck } from '@fortawesome/free-solid-svg-icons'
import axios, { isCancel } from "axios";
import { Question , Option } from "@/types";
export const QuizCreate = () => {
    const [questions, setQuestions] = useState<Question[]>([])
    const [currentQuestion, setCurrentQuestion] = useState<Question>({
      index:0,
      question: "",
      type: "multiple-choice",
      options: [{ index:0 ,text: "", isCorrect: false }],
      isEditing:false
    })
    const addOption = () => {
        setCurrentQuestion((prevQuestion) => ({
          ...prevQuestion,
          options: [...prevQuestion.options, { text: "", isCorrect: false , index : prevQuestion.options.length}],
        }))
      }
      const updateOption = (index : number, updatedOption : Option) => {
        if (currentQuestion.type === "true-false" && updatedOption.isCorrect) {
          //set previous correct to wrong
          setCurrentQuestion((prevQuestion) => ({
            ...prevQuestion,
            //set the already correct option to false
            options: prevQuestion.options.map((option, i) => (option.index ==index ?updatedOption : {...option , isCorrect : false})),
          }))
          return 
        }

        setCurrentQuestion((prevQuestion) => ({
          ...prevQuestion,
          options: prevQuestion.options.map((option, i) => (i === index ? { ...option,text: updatedOption.text, isCorrect : updatedOption.isCorrect } : option)),
        }))
      }
      const saveQuestion = async () => {
        if (currentQuestion.question === "") {
          return alert("Please enter a question")
        
        }
        if (questions.filter((q:Question) => q.question === currentQuestion.question).length > 0) {
          return alert("Question already exists")
        }

        setQuestions((prevQuestions : Question[]) => [...prevQuestions, currentQuestion])
        setCurrentQuestion({
          index:questions.length,
          question: "",
          type: "multiple-choice",
          options: [{ index:0,text: "", isCorrect: false }],
          isEditing:false
        })  
        // const res = await axios.post(`/api/question/${quizId}`, currentQuestion)
    }      
    const editQuestion = (questionIndex: number, updatedQuestion: Question) => {
    console.log("edit question",questions[questionIndex].options , updatedQuestion.options )
    setQuestions((prevQuestions) =>
        prevQuestions.map((question, index) =>
          index === question.index ? updatedQuestion : question
        )
      );
    };
  

    return(
        <div>
    <div className="p-6 space-y-4">
    <div className="space-y-2">
            <div className="space-y-2">
              <Label htmlFor="type">Question Type</Label>
              <Select
                value={currentQuestion.type}
                onValueChange={(value) =>
        {          setCurrentQuestion((prevQuestion) => ({
                    ...prevQuestion,
                    type: value,
                  }))
                  //change needed
                  let multipleCorrect = true;
                  let options = currentQuestion.options
                  if (value === "true-false") {
                    options = [{ index:0,text: "True", isCorrect: true }, { index:1,text: "False", isCorrect: false }]
                  }
                  else {
                    options = [{index:0, text: "", isCorrect: false}]
                  }
                  setCurrentQuestion((prevQuestion) => ({
                    ...prevQuestion,
                    options: options,
                  }))
        }        }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select question type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                  <SelectItem value="true-false">True/False</SelectItem>
                  <SelectItem value="short-answer">Short Answer</SelectItem>
                </SelectContent>
              </Select>
              <MultiSelect />
            </div>
      <Label htmlFor="question">Question</Label>
      <Textarea
        id="question"
        value={currentQuestion.question}
        onChange={(e) =>
          setCurrentQuestion((prevQuestion) => ({
            ...prevQuestion,
            question: e.target.value,
          }))
        }
        placeholder="Enter your question"
        className="min-h-[100px]"
      />
    </div>
    <div className="space-y-2">
      <Label>Options</Label>
      <div className="space-y-2">
        {currentQuestion.options.map((option, index) => (
          <div key={index} className="flex items-center gap-2">
            <Checkbox
              checked={option.isCorrect}
              onCheckedChange={(checked) => updateOption(index, {...option,text : option.text, isCorrect:Boolean(checked)})}
            />
            <Input
              value={option.text}
              onChange={(e) => updateOption(index, {...option,text :e.target.value, isCorrect:option.isCorrect})}
              placeholder={`Option ${index + 1}`}
            />
          </div>
        ))}
        <Button onClick={addOption} variant="outline">
          + Add Option
        </Button>
      </div>
    </div>
    <Button onClick={saveQuestion}>Save Question</Button>
  </div>
  <div id="display" className="p-6 space-y-4 ">
        {questions.map((question, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex justify-between">
            {question.isEditing ? (
              <Input
              className=" w-[90%]"
              value={question.question}
              onChange={(e) =>
                editQuestion(question.index, {
                  ...question,
                  question: e.target.value,
                })
              }
              />
            ) : (
              <p>{question.index+1 + ". "}
              {question.question}</p>
            )}
       <div className="justify-end">
        <FontAwesomeIcon className={`w-7 h-7 cursor-pointer ${question.isEditing ? "hidden" : ""}`}
         icon={faEdit} onClick={() => editQuestion(question.index, { ...question, isEditing: true })} />
        <FontAwesomeIcon color="green" className={ `w-7 h-7 ml-2 cursor-pointer ${!question.isEditing ? "hidden" : ""}`}
        icon={faCheck} onClick={() => editQuestion(question.index, { ...question, isEditing: false })} />
        </div> 

            </div>

              <CardDescription>
                {question.type === "multiple-choice"
                  ? "Multiple Choice"
                  : question.type === "true-false"
                  ? "True/False"
                  : "Short Answer"}
                  {//change needed add tags
                  }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {question.options.map((option, i) => (
                <div key={i} className="flex items-center gap-2">
                  
                  <Checkbox
                  disabled={!question.isEditing}
  checked={option.isCorrect}
  onCheckedChange={(checked) => {
    if (question.type === "true-false" && checked) {
      // Set all other options to false
      editQuestion(question.index, {
        ...question,
        options: question.options.map((prevOption, i) =>
          i === option.index ? { ...prevOption, isCorrect: true } : { ...prevOption, isCorrect: false }
        ),
      });
    } else {
      // Toggle the current option
      editQuestion(question.index, {
        ...question,
        options: question.options.map((prevOption, i) =>
          i === option.index ? { ...prevOption, isCorrect: Boolean(checked) } : prevOption
        ),
      });
    }
  }}
/>
                  
                  <Input
                    disabled={!question.isEditing}
                    value={option.text}
                    onChange={(e) =>{
                     

                      editQuestion(index, {
                        ...question,
                        options: question.options.map((option, optionIndex) =>
                          optionIndex === i
                            ? { ...option, text: e.target.value }
                            : option
                        ),
                      })}
                    }
                    />
                    </div>
                  ))}
    

        </CardContent>
      </Card>
    ))}
  </div>
  </div>
)}