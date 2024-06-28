"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { StudyRoomListData } from "@/types"
import { getUserData } from "@/app/actions"
import { Loader2 } from "lucide-react"
import axios from "axios"

export default function StudyRoomList() {
  
  const [groups, setGroups] = useState<any>([])
  const [showModal, setShowModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [roomCode, setRoomCode] = useState("")
  const [groupName, setGroupName] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)
  const handleJoinRoom = async () => {
    const joinedRoom = await axios.post('/api/study-rooms/join', {
      code: roomCode
    })
    const newGroup = {
      id: groups.length + 1,
      roomCode,
      joined: true,
      ownerName: "New Owner",
      name: "New Study Group",
    }
    setGroups([...groups, newGroup])
    setShowModal(false)
    setRoomCode("")
  }
  const handleCreateRoom = async () => {
try{
    const createdRoom = await axios.post('/api/study-rooms', {
        name: groupName,
        roomCode : roomCode || Math.random().toString(36).substring(2,8).toUpperCase()
        })
    
    const newGroup : StudyRoomListData= {
      id: createdRoom.data.id,
      code: createdRoom.data.code,
      owner: "You",
      name: createdRoom.data.name
    }

    setGroups([...groups, newGroup])
    setShowCreateModal(false)
    setRoomCode("")
    setGroupName("")}
    catch(error){
      console.error("Error creating room:", error);
    }
  }
  useEffect(() => {
    async function fetchGroups() {
try{      
    const {user} = await getUserData()
    if (!user) {
      return window.location.href = "/login"
    }
      const response = await axios.get('/api/study-rooms')
      const data = response.data as StudyRoomListData[]
      console
      setGroups(data) 
      setIsLoaded(true)
}
catch(error){
  console.error("Error fetching study rooms:", error);
}    

}
    fetchGroups()
},[])
  return (
    !isLoaded? <div className="flex justify-center items-center h-screen">
      <Loader2 className="w-16 h-16 text-blue-500 animate-spin" /> 
    </div>:
  
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Study Groups</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {groups
          .map((group:StudyRoomListData) => (
<div key={group.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer" onClick={() => window.location.href = "/study-room/" + group.id}>
  <div className="flex justify-between items-center mb-4">
    <span className="text-gray-500 dark:text-gray-400 font-medium">Room Code: {group.code}</span>
    <span className="text-green-500 dark:text-green-400 font-medium">Joined</span>
  </div>
  <h3 className="text-lg font-bold mb-2">{group.name}</h3>
  <p className="text-gray-500 dark:text-gray-400 mb-4">Hosted by {group.owner}</p>
</div>          ))}
      </div>
      <div className="flex justify-between items-center mt-8">
        <Button variant="outline" size="lg" className="bg-black text-white" onClick={() => setShowModal(true)}>
          Join a Room
        </Button>
        <Button variant="outline" size="lg" className="bg-black text-white" onClick={() => setShowCreateModal(true)}>
          Create a Room
        </Button>
      </div>
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Join a Room</DialogTitle>
            <DialogDescription>Enter the room code to join a study group.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="roomCode">Room Code</Label>
              <Input
                id="roomCode"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                placeholder="Enter room code"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleJoinRoom}>Join</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create a Room</DialogTitle>
            <DialogDescription>Enter a room name and code to create a new study group.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="groupName">Room Name</Label>
              <Input
                id="groupName"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter room name"
              />
            </div>
            <div>
              <Label htmlFor="roomCode">Room Code</Label>
              <Input
                id="roomCode"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                placeholder="Enter room code"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateRoom}>Create</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}