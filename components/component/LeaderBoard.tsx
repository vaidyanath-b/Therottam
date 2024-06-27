"use client"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect } from "react";
import { getUserData } from "@/app/actions";

import { useState } from "react";
interface User {
  username: string;
  contentsCompleted: number;
  quizzesWon: number;
  quizScore: number;
  contentCreated: number;
  quizzesCreated: number;
}






export default function Leaderboard({username , roomId} : {username:String,roomId:String}) {


    const [usersData, setUsersData] = useState<User[]>(
      [
        {
          username : "Vaiii",
          contentsCompleted : 3,
          quizzesWon : 2,
          quizScore : 80,
          contentCreated : 4,
          quizzesCreated : 5
        },
        {
          username : "Bob",
          contentsCompleted : 2,
          quizzesWon : 1,
          quizScore : 70,
          contentCreated : 3,
          quizzesCreated : 4
        },
        {
          username : "Alice",
          contentsCompleted : 1,
          quizzesWon : 0,
          quizScore : 60,
          contentCreated : 2,
          quizzesCreated : 3
        },
        {
          username : "Charlie",
          contentsCompleted : 0,
          quizzesWon : 0,
          quizScore : 50,
          contentCreated : 1,
          quizzesCreated : 2
        }

        
      ])

    useEffect(() => {
        async function getUsersData() {
            fetch(`/api/study-rooms/${roomId}/leaderboard`)
                .then((res) => res.json())
                .then((data) => {
                    // setUsersData(data)
                })
        }
        getUsersData()
    }, [])

    
  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Leaderboard</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FilterIcon className="w-4 h-4" />
            <span>Filter</span>
          </Button>
          <Button variant="outline" size="sm">
            <ListOrderedIcon className="w-4 h-4" />
            <span>Sort</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Contents Completed</TableHead>
              <TableHead>Quizzes Won</TableHead>
              <TableHead>Quiz Score</TableHead>
              <TableHead>Content Created</TableHead>
              <TableHead>Quizzes Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersData.map((user) => (
              <TableRow key={user.username}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>{user.username[0].toUpperCase() + user.username[1].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{user.username}</div>
                  </div>
                </TableCell>
                <TableCell>{user.contentsCompleted}</TableCell>
                <TableCell>{user.quizzesWon}</TableCell>
                <TableCell>{user.quizScore}</TableCell>
                <TableCell>{user.contentCreated}</TableCell>
                <TableCell>{user.quizzesCreated}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">Showing 1-5 of {usersData.length} users</CardFooter>
    </Card>
  );
}

function FilterIcon(props:any) {
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
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
    )
    }
    
    
    function ListOrderedIcon(props:any) {
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
    <line x1="10" x2="21" y1="6" y2="6" />
    <line x1="10" x2="21" y1="12" y2="12" />
    <line x1="10" x2="21" y1="18" y2="18" />
    <path d="M4 6h1v4" />
    <path d="M4 10h2" />
    <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
    </svg>
    )
    }