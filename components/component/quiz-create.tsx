"use client"
import { useEffect, useState } from "react";
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
import { faEdit, faCheck , faDeleteLeft } from '@fortawesome/free-solid-svg-icons'
import axios, { isCancel } from "axios";
import { Question , Option, Topic } from "@/types";
import { useParams } from "next/navigation";

interface Props {
  quizId: string;
}

export const QuizCreate = () => {
    const params = useParams()
    const quizId = params.quizId
    const [questions, setQuestions] = useState<Question[]>([])
    const [loading, setLoading] = useState(true)
    const [currentQuestion, setCurrentQuestion] = useState<Question>({
      id:"",
      index:0,
      question: "",
      type: "MULTIPLE_CHOICE",
      options: [{ index:0 ,text: "", isCorrect: false }],
      isEditing:false,
      tags: []
    })
    async function updateTags(questionIndex : number, tags : Topic[]) {
      
      if (questionIndex === -1) {
        setCurrentQuestion((prevQuestion) => ({
          ...prevQuestion,
          tags: tags,
        }));
      }
      let tagIds = tags.map((tag) => tag.id)
      setQuestions((prevQuestions) =>
        prevQuestions.map((question, index) =>
          question.index === questionIndex ? { ...question, tags: tags } : question
        )
      );
    }
    const [topics, setTopics] = useState<Topic[]>([])
     const addOption = () => {
        setCurrentQuestion((prevQuestion) => ({
          ...prevQuestion,
          options: [...prevQuestion.options, { text: "", isCorrect: false , index : prevQuestion.options.length}],
        }))
      }
      const updateOption = (index : number, updatedOption : Option) => {
        if (currentQuestion.type === "TRUE_FALSE" && updatedOption.isCorrect) {
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

        const optionsSend = currentQuestion.options.filter((option) => option.isCorrect).map((option) => option.text)
        const postQuestion = {
          ...currentQuestion,
          index : questions.length,
          options: currentQuestion.options.map((option) => option.text),
          tags: currentQuestion.tags.map((tag) => tag.id),
          correctOption: optionsSend,
          quizId: quizId
          }
          const res = await axios.post(`/api/question`, { question :postQuestion})// change needed
          setQuestions((prevQuestions : Question[]) => [...prevQuestions, {...currentQuestion , index:prevQuestions.length}])

            setCurrentQuestion({
              id:"",
              index:questions.length,
              question: "",
              type: "MULTIPLE_CHOICE",
              options: [{ index:0,text: "", isCorrect: false }],
              isEditing:false,
              tags: []
            })  
    }      
    const editQuestion = async (questionIndex: number, updatedQuestion: Question) => {
    setQuestions((prevQuestions) =>
        prevQuestions.map((question) =>
          questionIndex === question.index ? updatedQuestion : question
        )
      );    
    };

    const updateQuestion = async (questionIndex: number,updatedQuestion : Question) => {
    const optionsSend =updatedQuestion.options.filter((option) => option.isCorrect).map((option) => option.text)
      const postQuestion = {
        ...updatedQuestion,
        options: updatedQuestion.options.map((option) => option.text),
        tags: updatedQuestion.tags.map((tag) => tag.id),
        correctOption: optionsSend,
        quizId: quizId
        }

      const res = await axios.put(`/api/question/${updatedQuestion.id}`, {question:postQuestion})
      console.log("updated" , res.data)
      // change needed update question
      // const res = await axios.put(`/api/question/${quizId}`, questions[questionIndex]) change needed update question
      // console.log(res.data)
    }

    useEffect(() => {
      setLoading(true)
      async function fetchTopics() {
        const res = await axios.get(`/api/topics`) // change needed handle case for mulitple topicdomains
        console.log(res.data)
        setTopics(res.data)

    }

      async function fetchQuiz() {
        const res = await axios.get(`/api/quiz/${quizId}`)
        console.log(res.data)
        console.log("console ",res.data)

        setQuestions(res.data.quiz.questions)
        //setTags(res.data.quiz.topics) // need change for quiz tags
        setLoading(false)
      }
      fetchTopics()
      fetchQuiz()
    } , [])
  

    return(
      !loading &&  
       ( <div>
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
                  if (value === "TRUE_FALSE") {
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
                  <SelectItem value="MULTIPLE_CHOICE">Multiple Choice</SelectItem>
                  <SelectItem value="TRUE_FALSE">True/False</SelectItem>
                  <SelectItem value="short-answer">Short Answer</SelectItem>
                </SelectContent>
              </Select>
              <MultiSelect index={-1} updateTags={updateTags}  values={currentQuestion.tags}/>
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
        {questions.map((question) => (
          <Card key={question.index}>
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
        icon={faCheck} onClick={() => {
          
          updateQuestion(question.index ,question)
          editQuestion(question.index, { ...question, isEditing: false })
          document.getElementById("display")?.scrollIntoView({ behavior: 'smooth'});
        }} />
        <FontAwesomeIcon color="red" className={ `w-7 h-7 ml-2 cursor-pointer ${!question.isEditing ? "hidden" : ""}`}
        icon={faDeleteLeft} onClick={() => {
          axios.delete(`/api/quiz/${quizId}/${question.id}`)
          setQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== question.id))
        }
        } />
        </div> 

            </div>

              <CardDescription>
                {question.type === "MULTIPLE_CHOICE"
                  ? "Multiple Choice"
                  : question.type === "TRUE_FALSE"
                  ? "True/False"
                  : "Short Answer"}
                  {//change needed add tags
                  }
              <MultiSelect index={question.index} updateTags={updateTags} values={question.tags} />
              </CardDescription>
            </CardHeader>
            <CardContent>
              {question.options.map((option, i) => (
                <div key={i} className="flex items-center gap-2">
                  
                  <Checkbox
                  disabled={!question.isEditing}
  checked={option.isCorrect}
  onCheckedChange={(checked) => {
    if (question.type === "TRUE_FALSE" && checked) {
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
                     

                      editQuestion(question.index, {
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
)


    )
}