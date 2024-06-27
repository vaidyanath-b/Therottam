"use client"
import SolvePage from "./SolveTasks";
import Modules from "./createSolvable";
import { useEffect } from "react";

export default function  Components ({roomId, selectedDay, isLive, isDead} : {roomId: string, selectedDay: number, isLive: boolean, isDead: boolean}) {

    return (
        isLive || isDead ? <SolvePage day={selectedDay}/>:
        <Modules roomId={String(roomId)} day = {selectedDay}   />       
    )
}