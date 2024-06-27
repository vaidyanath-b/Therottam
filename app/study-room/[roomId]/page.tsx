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
  ShieldHalf,
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
import Popup from "@/components/component/Popup"
import Leaderboard from "@/components/component/LeaderBoard"

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
  const [leaderboardOpen, setLeaderboardOpen] = React.useState(false)
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
            <Popup isOpen={leaderboardOpen} setIsOpen={setLeaderboardOpen}  >
              <Leaderboard username={userName} roomId={String(roomId)}/>
            </Popup>
            <Button onClick={()=>setLeaderboardOpen(true)}

              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
            <ShieldHalf className="h-4 w-4"/>
              Leaderboard
              <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                6  {/* change needed replace with dynamic value */}
              </Badge>
            </Button>
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
      </TabsList>
      <TabsContent value="quiz" className="flex flex-col pl-30 p-10 gap-y-7">
          {quizes && quizes.map((quiz:any,index) => (
                 <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
                <h1 className="text-3xl font-bold mb-8">Day {selectedDay} Quizes</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                        <div className="block mb-1 text-2xl font-bold hover:text-primary" >{quiz.title || `Quiz ${index+1} `}</div>
                       <div className="flex flex-col"> <span className="text-xs font">{quiz.questionCount} Questions</span>
                          <span className="text-xs font">Creator {quiz.creator_id}</span>
                          </div>
                        <div className="flex items-center mb-4">
{                          quiz.topics?.map((topic:any) => (
                            <span className="text-muted-foreground text-sm">Topics: {topic.topic}</span>
                          )) || <span className="text-muted-foreground text-sm">General Quiz</span>
                          
}                       
 </div>
                        <div className="flex justify-between items-center">
                        {quiz.creator_id === userName ? (
              <Button className="h-7" onClick={() => (window.location.href = `/quiz/${quiz.quizId}`)}>Edit Quiz</Button>
) : ( quiz.questionCount === 0) ? null : (
  <Button className="h-7" onClick={() => (window.location.href = `/study-room/${roomId}/${quiz.quizId}/${selectedDay}`)}>Attempt Quiz</Button>
)}
                        </div>
                    </div>
                </div>
            </div>
            </div>

            ))

        }
                </TabsContent>

      <TabsContent value="contents">
<Components roomId={String(roomId)} selectedDay={selectedDay} isDead={dayInfo.isDead} isLive={dayInfo.isLive} />
      </TabsContent>
    </Tabs>

        </div>
      </div>
        </div>

  )
}
