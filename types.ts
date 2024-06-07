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

export interface Topic{
    id:string,
    name:string,
}
  