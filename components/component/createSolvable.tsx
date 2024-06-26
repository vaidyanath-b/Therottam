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

interface Params {
  roomId : string,
  day : number,
}
export default function Modules(params : Params) {
  const [userName , setUserName] = useState<String>("")
  const [contents , setContents] = useState([
  ])
  const [customSections, setCustomSections] = useState([
    {
      title: "",
      link: "",
      resources: "",
    },
  ])
  const [dayInfo , setDayInfo] = useState({})
  const handleAddCustomSection = () => {
    setCustomSections([
      ...customSections,
      {
        title: "",
        link: "",
        resources: "",
      },
    ])
  }
  const handleCustomSectionChange = (index, field, value) => {
    const updatedCustomSections = [...customSections]
    updatedCustomSections[index][field] = value
    setCustomSections(updatedCustomSections)
  }

  useEffect(() => {
    async function fetchContents() {
      const res = await fetch(`/api/study-rooms/${params.roomId}/${params.day}/tasks`)
      const data = await res.json()
      console.log(data)
      setContents(data.tasks)
      setDayInfo(data.dayInfo)
    }
    fetchContents()
  }, [params])

  useEffect(() => {
    async function getUserName(){
      const {username} = await getUserData()
      setUserName(String(username))  //???
    }
    getUserName()
},[])
  return (
    <main className="w-full max-w-4xl mx-auto py-12 md:py-20 lg:py-28 px-4 md:px-6">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {contents.map((content:any, index) => (
                <div key={index} className={`space-y-6 ${content.creator_id == userName ? "" : "hidden"}`}>
            <div className="space-y-2">
              <div className={`inline-block rounded-lg ${content.difficulty ==="EASY" ?"bg-green-100" : content.difficulty ==="MEDIUM" ? "bg-yellow-100" : "bg-red-100"}
                 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-200 `}>
                {content.difficulty}
              </div>
              <h3 className="text-2xl font-bold">{
                  content.title || `${content.difficulty} Task`
                }</h3>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="easy-title">Title</Label>
                <Input type="text" id="easy-title" placeholder="Enter a title" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="easy-link">Link</Label>
                <Input type="text" id="easy-link" placeholder="Enter a link" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="easy-resources">Resources</Label>
                <Textarea id="easy-resources" placeholder="Enter resources" rows={3} />
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
              <h3 className="text-2xl font-bold">Custom Section {index + 1}</h3>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor={`custom-title-${index}`}>Title</Label>
                <Input
                  type="text"
                  id={`custom-title-${index}`}
                  placeholder="Enter a title"
                  value={section.title}
                  onChange={(e) => handleCustomSectionChange(index, "title", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`custom-link-${index}`}>Link</Label>
                <Input
                  type="text"
                  id={`custom-link-${index}`}
                  placeholder="Enter a link"
                  value={section.link}
                  onChange={(e) => handleCustomSectionChange(index, "link", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`custom-resources-${index}`}>Resources</Label>
                <Textarea
                  id={`custom-resources-${index}`}
                  placeholder="Enter resources"
                  rows={3}
                  value={section.resources}
                  onChange={(e) => handleCustomSectionChange(index, "resources", e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
        <div className="col-span-4 flex justify-end">
          <Button onClick={handleAddCustomSection}>Add Custom Section</Button>
        </div>
      </div>
    </main>
  )
}