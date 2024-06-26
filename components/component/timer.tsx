/**
 * v0 by Vercel.
 * @see https://v0.dev/t/LjcoRrrlR0v
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export default function Timer() {
  const [isRunning, setIsRunning] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [intervalId, setIntervalId] = useState(null)
  const handleStart = () => {
    setIsRunning(true)
    const id = setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 1000)
    }, 1000)
    setIntervalId(id)
  }
  const handleStop = () => {
    setIsRunning(false)
    clearInterval(intervalId)
  }
  const handleReset = () => {
    setIsRunning(false)
    clearInterval(intervalId)
    setElapsedTime(0)
  }
  useEffect(() => {
    handleStart()
  },[])
  const minutes = Math.floor(elapsedTime / 60000)
  const seconds = Math.floor((elapsedTime % 60000) / 1000)
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <div className="text-6xl font-bold">
        {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
      </div>
      
    </div>
  )
}