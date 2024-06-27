import { Sidebar } from "@/components/component/sidebar";
import StudyRoomList from "@/components/component/studygrouplist";
export default function Home() {
  
  return(
    <div>
    <Sidebar/>
    <div className="container mx-auto px-4 py-8">
      <StudyRoomList />
    </div>
    </div>
  )
  }