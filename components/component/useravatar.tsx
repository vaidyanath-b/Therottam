


import Image from "next/image";
import { Avatar,  } from "../ui/avatar";
import { UserRound } from "lucide-react";



const UserAvatar = () => {

  return (
    <Avatar>
     
        <div className="relative w-full h-full aspect-square p-1 text-gray-700 transition-all duration-200 bg-white rounded-full hover:text-gray-900 focus:outline-none hover:bg-gray-100">
          {/* <Image
            fill
            src="https://landingfoliocom.imgix.net/store/collection/clarity-dashboard/images/previews/dashboards/1/avatar-male.png"
            alt="user profile"
            referrerPolicy="no-referrer"
          /> */}
          <UserRound  className="w-6 h-6 mt-1 ml-1"/>
        </div>
    </Avatar>
  );
};

export default UserAvatar;