"use client"
import Link from "next/link"
import {
  Bell,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent , SelectGroup , SelectItem, SelectLabel , SelectTrigger, SelectValue } from "@/components/ui/select"
import React, { useEffect } from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { useParams } from "next/navigation"
import { getUserData } from "@/app/actions"
import Modules from "@/components/component/createSolvable"
import SolvePage from "@/components/component/SolveTasks"
import Components from "@/components/component/Contents"

export default function StudyRoom() {
  const [studyRoomName , setStudyRoomName] = React.useState("DSA")
  const [activeTab, setActiveTab] = React.useState("quiz")
  const [selectedDay , setSelectedDay] = React.useState(-1)
  const [days, setDays] = React.useState<number[]>(Array.from({length: 30}, (_, i) => i + 1)); // replace 30 with your desired number of days
  const {roomId} = useParams();
  const [quizes , setQuizes] = React.useState([])
  const [contents , setContents] = React.useState([])
  const [userName , setUserName] = React.useState<String>("")
  const [dayInfo , setDayInfo] = React.useState<any>()
  useEffect(() => {
    async function getRoomDay(){fetch(`/api/study-rooms/${roomId}/room-status`)

      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setSelectedDay(data.day)
      })
    }
    getRoomDay()  
  }, [roomId])
  useEffect(()=>{
    async function getUserName(){
      const {username} = await getUserData()
      setUserName(String(username))  //???
    }
    getUserName()
  })
  useEffect(() => {
    if(selectedDay==-1)
      return;
    async function getDayItems(){
      fetch(`/api/study-rooms/${roomId}/room-status/${selectedDay}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setQuizes(data.StudyRoomQuiz)
        setDayInfo({isLive : data.isLive,isDead :data.isDead})
      })
    }
    getDayItems()
  }, [selectedDay])
  console.log("roomId is " ,roomId)
  return (
    dayInfo && selectedDay!=-1 && <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">{studyRoomName}</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <ShoppingCart className="h-4 w-4" />
              Orders
              <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                6
              </Badge>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
            >
              <Package className="h-4 w-4" />
              Products{" "}
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Users className="h-4 w-4" />
              Customers
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <LineChart className="h-4 w-4" />
              Analytics
            </Link>
          </nav>
        </div>
    </div>
        </div>
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between px-4 py-2 border-b lg:px-6 lg:py-3">
      <Select value={String(selectedDay)}
        onValueChange={(value) => setSelectedDay(Number(value))}
      >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a Day" />
      </SelectTrigger>
      <SelectContent >
        <SelectGroup>
          <SelectLabel>Select a day</SelectLabel>
          {days.map((day) => (
            <SelectItem
              value={String(day)}
            >
              {day}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
        </div>
        <div className="">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
        <TabsTrigger value="quiz">Quiz</TabsTrigger>
        <TabsTrigger value="contents">Tasks</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="quiz" className="flex flex-col pl-30 p-10 gap-y-7">
          {quizes && quizes.map((quiz:any,index) => (
            <div className="flex flex-row gap-x-2  items-baseline">
              <Label className="font-bold font">Quiz {index +1}</Label>
{            
(!dayInfo.isLive && !dayInfo.isDead && quiz.creator_id == userName)? <Button className="h-7" onClick={()=>window.location.href=`/study-room/${roomId}/${quiz.quizId}`}> Edit Quiz 
              </Button>
              :
              dayInfo.isLive ? quiz.creator_id == userName ?
                           <Button className="h-7" onClick={()=>window.location.href=`/study-room/${roomId}/${quiz.quizId}`}>Edit Quiz</Button> :  //change needed cannot edit while ongoing except for day1 or do something for day1
                                                      <Button className="h-7">Attempt Quiz</Button> :
                           <Button className="h-7">View Quiz</Button>
}           
<Label className="font-bold font">Creator {quiz.creator_id}</Label>


            </div>
          ))}
                </TabsContent>

      <TabsContent value="contents">
<Components roomId={String(roomId)} selectedDay={selectedDay} isDead={dayInfo.isDead} isLive={dayInfo.isLive} />
      </TabsContent>
      <TabsContent value="settings">
      </TabsContent>
    </Tabs>

        </div>
      </div>
        </div>

  )
}
