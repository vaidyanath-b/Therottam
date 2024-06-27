"use client"
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/CrSmq5VloDa
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState,useEffect } from "react"
import { useParams } from "next/navigation"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckDouble } from '@fortawesome/free-solid-svg-icons'

interface Content {
    activity: null | string,
    createdAt: string,
    creator_id: string,
    date: null | string,
    day: number,
    difficulty: "EASY" | "MEDIUM" | "HARD",
    link : null | string,
    id: number,
    isLive: boolean,
    resource: null | string,
    scheduled_date: null | string,
    studyRoom_id: string,
    title: null | string,
    topic_id: null | string,
    ContentMark : any
    };
interface Params {
    day : number,
}

export default function SolvePage(params:Params) {
const {roomId} = useParams();

const [tasks , setTasks] = useState<Content[]>([])
useEffect(() => {
    async function getTasks(){
        fetch(`/api/study-rooms/${roomId}/${params.day}/tasks`)
        .then((res) => res.json())
        .then((data) => {
            setTasks(data.tasks)

        })
    }
    getTasks()
},[params.day])
  return (
    <div className="container mx-auto py-0 my-0 px-4 md:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Day {params.day} tasks</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {
            tasks.map((task) => (
            
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                        <div  className="block mb-3 text-2xl font-bold hover:text-primary" >
                          {task.title || `${task.difficulty} task`}
                          
                          </div>
                        <div className="flex items-start gap-y-4 mb-2 flex-col">
                        {<span className="text-muted-foreground text-sm">Link: {task.link?<a>{task.link}</a> : "No link added"}</span>}
                            <div className="flex justify-between w-[80%]">
                            <span className={`${task.difficulty === "EASY" ? "bg-green-500" : task.difficulty === "MEDIUM" ? "bg-yellow-500" : "bg-red-500"} text-white px-2 py-1 rounded-full text-xs font-medium mr-2`}>{task.difficulty}</span>
                            <span className="text-muted-foreground text-sm">{task.creator_id}</span>
                            </div>
                            {<span className="text-muted-foreground text-sm">Resources: {task.resource || "No resource added"}</span>}
                        </div>
                        <div className="flex justify-between items-center">
{                           
  
(!task.ContentMark || task.ContentMark.length === 0) 
 ?<Button size="sm" variant="secondary" onClick={()=>{
                                fetch(`/api/study-rooms/${roomId}/${params.day}/tasks/${task.id}/mark-as-done`,{
                                    method: "POST"
                                }).then((res) => res.json())
                                .then((data) => {
                                    setTasks((prevTasks) => prevTasks.map((prevTask) => {
                                        if(prevTask.id === task.id){
                                            return {...prevTask , ContentMark: "marked"}
                                        }
                                        return prevTask
                                    }))
                                })
}}>Mark as Done</Button> : 
                            //gree double tick mark
                      <FontAwesomeIcon icon={faCheckDouble} />
}
                        </div>
                    </div>
                </div>
            ))

        }
      </div>
      <div>
        <div>
          <div className="gap-y-3 py-8 font-bold text-xl">
            <div>Discuss the tasks with your group.</div>
          </div>
          <div>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <div className="font-medium">John Doe</div>
                  <div className="text-muted-foreground">
                    The UI looks really bad !!!
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <div className="font-medium">Jane Smith</div>
                  <div className="text-muted-foreground">
                    I agree.
                  </div>
                </div>
              </div>
            </div>
            <Separator className="my-6" />
            <div className="grid gap-2">
              <Label htmlFor="comment">Add a comment</Label>
              <Textarea id="comment" placeholder="Type your comment here..." rows={3} />
              <Button type="submit">Submit</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MessageCircleIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  )
}