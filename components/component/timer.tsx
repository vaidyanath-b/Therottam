import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export default function Timer() {
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [elapsedTime, setElapsedTime] = useState<number>(0)
  // Updated to use `number | null` to correctly type the interval ID
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)
  
  const handleStart = () => {
    setIsRunning(true)
    const id = setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 1000)
    }, 1000)
    setIntervalId(id)
  }
  
  const handleStop = () => {
    setIsRunning(false)
    if (intervalId) clearInterval(intervalId)
  }
  
  const handleReset = () => {
    setIsRunning(false)
    if (intervalId) clearInterval(intervalId)
    setElapsedTime(0)
  }
  
  useEffect(() => {
    handleStart()
    // Cleanup function to clear the interval when the component unmounts
    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  },[])
  
  const minutes = Math.floor(elapsedTime / 60000)
  const seconds = Math.floor((elapsedTime % 60000) / 1000)
  
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <div className="text-6xl font-bold">
        {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
      </div>
      {/* Buttons for controlling the timer */}
      <div>
        <Button onClick={handleStart} disabled={isRunning}>Start</Button>
        <Button onClick={handleStop} disabled={!isRunning}>Stop</Button>
        <Button onClick={handleReset}>Reset</Button>
      </div>
    </div>
  )
}