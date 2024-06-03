export interface Option {
    index:number
    text: string;
    isCorrect: boolean;
  }
  
export interface Question {
    isEditing:boolean;
    index:number;
    question: string;
    type: string;
    options: Option[];
  }
  