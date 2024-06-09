export interface Option {
    index:number
    text: string;
    isCorrect: boolean;
  }
  
export interface Question {
    id: string;
    isEditing:boolean;
    index:number;
    question: string;
    type: string;
    options: Option[];
    tags : Topic[];
  }
export interface StudyRoomData {
    name: string;
    roomCode: string;
  }

export interface Topic{
    id:string,
    name:string,
}
  

export interface StudyRoomListData {
    id: string;
    name: string;
    owner: string;
    code: string;
  }