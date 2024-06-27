"use client"
import { LogOut } from "lucide-react";
    import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
    import UserAvatar from "./useravatar";
    import { useRouter } from "next/navigation";
   import { useEffect, useState } from "react";
    import {Logout, getUserData} from "@/app/actions/index";
    
 const UserAccountInfo =  () => {
    
        const [email,setEmail] = useState('')
        const [username,setUsername] = useState('')
        const router = useRouter();
    useEffect(()=>{
        async function fetchData(){
        const data = await getUserData()
        setEmail(data.user?.email || "")
        setUsername(data?.username || "")
        return
        }
        fetchData()
    },[])
    return (
        <DropdownMenu>
        <DropdownMenuTrigger>
            <UserAvatar />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            {email ? (
            <>
                <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                    <p className="text-sm font-semibold text-black">{username}</p>
                    <p className="w-[200px] truncate text-sm text-black">{email}</p>
                </div>
                </div>

                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={async()=>{
                    await Logout()
                    router.push('login')}}
    className="text-red-500 cursor-pointer">
                Sign out
                <LogOut className="w-4 h-4 ml-2" />
                </DropdownMenuItem>
            </>
            ) : (
            // Show this message when there is no email
            <DropdownMenuItem className="text-gray-900 cursor-pointer" onSelect={() => {
                router.push('/login');
            }}>
                <p className="w-full p-2 text-sm">Sign in to view your profile details</p>
            </DropdownMenuItem>
            )}
        </DropdownMenuContent>
        </DropdownMenu>
    );
    };
export default UserAccountInfo