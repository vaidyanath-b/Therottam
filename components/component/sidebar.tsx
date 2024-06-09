"use client"
import { useState } from "react";
import Header from "./header";

export  function Sidebar () {
    const [isOpen , setIsOpen] = useState(false)
    return <Header onMenuClick={()=>{setIsOpen((prevOpen)=>!prevOpen)}} />
}
