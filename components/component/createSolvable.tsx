/**
 * v0 by Vercel.
 * @see https://v0.dev/t/nIFhuynT24G
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client"

import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { getUserData } from "@/app/actions"
import axios, { Axios } from "axios"
interface Params {
  roomId : string,
  day : number,
}

interface Content  {
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
};
export default function Modules({ roomId, day }: { roomId: string; day: number }) 
{ 
   const [userName , setUserName] = useState<String>("")
  const [contents , setContents] = useState<Content[]>([])
  const [customSections, setCustomSections] = useState([
    {
      title: "",
      link: "",
      resources: "",
      difficulty: "EASY",
    },
  ])
  const [dayInfo , setDayInfo] = useState<any>()
  const handleAddCustomSection = () => {
    setCustomSections([
      ...customSections,
      {
        title: "",
        link: "",
        resources: "",
        difficulty: "EASY",
      },
    ])
  }
  const handleCustomSectionChange = (index:number, field:any, value:any) => {
    const updatedCustomSections :any= [...customSections]
    updatedCustomSections[index][field] = value
    setCustomSections(updatedCustomSections)
  }
  
  const handleContentChange = (id:any, event:any) => {
    const updatedContents = contents.map((item:Content) => {
      if (id === item.id) { // Check if the current item is the one to update
        return {
          ...item,
          [event.target.id]: event.target.value, // Update the necessary property
        };
      }
      return item; // Return the item unchanged if it's not the one to update
    });    
    setContents(updatedContents);
  };

  const saveContent = async (index:number) => {
    const section = customSections[index]
    const res = await axios.post(`/api/study-rooms/${roomId}/${day}/tasks`, {
      title: section.title,
      link: section.link,
      resources: section.resources,
      difficulty: section.difficulty,
      creator_id : userName
    })
  }
  useEffect(() => {
    async function fetchContents() {
      const res = await fetch(`/api/study-rooms/${roomId}/${day}/tasks`)
      const data = await res.json()
      setContents(data.tasks)
      setDayInfo(data.dayInfo)
    }
    fetchContents()
  }, [day])

  useEffect(() => {
    async function getUserName(){
      const {username} = await getUserData()
      setUserName(String(username))  //???
    }
    getUserName()
},[])
  return (
    
      <main className="w-full max-w-4xl sm:ml-20 py-12 md:py-20 lg:py-28 px-4 md:px-6">
      <div className="md:grid gap-8 md:grid-cols-2 sm:flex sm:flex-col gap-y-4">
      {contents.map((content:Content, index) => (
        <div key={content.id} className={`space-y-6 ${content.creator_id == userName ? "" : "hidden"} py-4`}>
          <div className="space-y-2 gap-y-2">
            <div className={`inline-block rounded-lg ${content.difficulty === "EASY" ? "bg-green-100" : content.difficulty === "MEDIUM" ? "bg-yellow-100" : "bg-red-100"}
               px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-200 `}>
              {content.difficulty}
            </div>
            <h3 className="text-2xl font-bold">
              {content.title || `${content.difficulty} Task`}
            </h3>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor={`title-${index}`}>Title</Label>
              <Input type="text" id="title" placeholder="Enter a title" value={content.title || ""} onChange={(e) => handleContentChange(content.id, e)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`link-${index}`}>Link</Label>
              <Input type="text" id="link"  placeholder="Enter a link" value={content.link || ""} onChange={(e) => handleContentChange(content.id, e)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`resources-${index}`}>Resources</Label>
              <Textarea id="resources"  placeholder="Enter resources" rows={3} value={content.resource || ""} onChange={(e) => handleContentChange(content.id, e)} />
            </div>
          </div>
        </div>
      ))}
        
      {customSections.map((section, index) => (
          <div key={index} className="space-y-6">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Custom
              </div>
              <h3 className="text-2xl font-bold">Custom {index + 1}</h3>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor={`custom-title-${index}`}>Title</Label>
                <Input
                  type="text"
                  id={`title`}
                  placeholder="Enter a title"
                  value={section.title}
                  onChange={(e) => handleCustomSectionChange(index, "title", e.target.value)}
                  />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`custom-link-${index}`}>Link</Label>
                <Input
                  type="text"
                  id={`link`}
                  placeholder="Enter a link"
                  value={section.link}
                  onChange={(e) => handleCustomSectionChange(index, "link", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex gap-2 items-baseline">
  <Label htmlFor={`custom-difficulty-${index}`}>Difficulty</Label>
  <select
    id={`difficulty`}
    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
    value={section.difficulty}
    onChange={(e) => handleCustomSectionChange(index, "difficulty", e.target.value)}
  >
    <option value="EASY">Easy</option>
    <option value="MEDIUM">Medium</option>
    <option value="HARD">Hard</option>
  </select>
</div>
                <Label htmlFor={`custom-resources-${index}`}>Resources</Label>
                <Textarea
                  id={`custom-resources-${index}`}
                  placeholder="Enter resources"
                  rows={3}
                  value={section.resources}
                  onChange={(e) => handleCustomSectionChange(index, "resources", e.target.value)}
                />
                <Button onClick={()=>saveContent(index)} size="sm">Save</Button>

              </div>
            </div>
          </div>
        ))}
        <div className="col-span-4 flex justify-center mt-20">
        <Button onClick={handleAddCustomSection}>Add Custom Section</Button>
        </div>
        </div>
        </main>
      
      )
    }