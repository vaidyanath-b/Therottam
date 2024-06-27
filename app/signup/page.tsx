"use client"
import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"
import { signup } from "@/app/actions/actions"

export default function Component() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const handleSubmit = async (event:any) => {
    event.preventDefault()
    await signup( email, password,username )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>Enter your email ,username and password to create your account.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" type="text" placeholder="bobby" required onChange={e => setUsername(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required placeholder='pass' onChange={e => setPassword(e.target.value)} />
            </div>

          </CardContent>
          <CardFooter className='flex flex-col items-start'> 
  <a href="/login" className=" text-sm text-left text-blue-500 hover:underline pb-4 pl-1">Login</a>
  <Button type="submit" className="w-full">Sign up</Button>
</CardFooter>
        </form>
      </Card>
    </div>
  )
}