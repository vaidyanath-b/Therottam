/**
 * v0 by Vercel.
 * @see https://v0.dev/t/qm83i3IWQJA
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client"

import { useEffect, useState } from "react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Topic } from "@prisma/client"
import axios from "axios"

type Props = {
  values: Topic[]
  index : number
  updateTags : (index:number,tags:Topic[]) => void

}

export default function MultiSelect({ values,index,updateTags }: Props) {

  const [selectedTags, setSelectedTags] = useState<Topic[]>(values || [])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredTags, setFilteredTags] = useState<Topic[]>([])
  const [allTags ,setAllTags] = useState<Topic[]>([])
  const handleTagSelect = (tag : Topic) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
      updateTags(index,selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
      updateTags(index,[...selectedTags, tag])
    }
  }
  const handleTagRemove = (tag : Topic) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag))
    updateTags(index,selectedTags.filter((t) => t !== tag))
  }
  useEffect(()=>{
    async function fetchTags(){
try{     
      const res = await axios.get("/api/topics")
      const data = res.data
      setAllTags(data)
}
catch(e){
}    

}
    fetchTags()
  }
  ,[])

  useEffect(() => {
    setSelectedTags(values || [])
  }
  ,[values])
  return (
    <div className="space-y-4">
      <div className="relative">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
                
              <span>{selectedTags.length ? selectedTags.map((tag) => tag.name).join(", ") : "Select tags"}</span>
    
              <ChevronDownIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[300px] p-2">
            <DropdownMenuLabel>
              <div className="relative">
                <SearchIcon className="absolute left-2 top-2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search tags..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setFilteredTags(allTags.filter((tag) => tag.name.toLowerCase().includes(searchTerm.toLowerCase())))
                  }}
                  onKeyDown={(e) => e.stopPropagation()}

                  className="w-full rounded-md border border-gray-300 px-8 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                />
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {filteredTags.map((tag) => (
                <DropdownMenuCheckboxItem
                  key={tag.id}
                  checked={selectedTags.includes(tag)}
                  onCheckedChange={() => handleTagSelect(tag)}
                >
                  {tag.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200"
          >
            {tag.name}
            <button
              type="button"
              className="ml-2 -mr-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              onClick={() => handleTagRemove(tag)}
            >
              <span className="sr-only">Remove {tag.name}</span>
              <XIcon className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function ChevronDownIcon(props:any) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}


function SearchIcon(props:any) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}


function XIcon(props:any) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}