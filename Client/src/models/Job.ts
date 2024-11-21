import { Task } from "./Task";

export interface Job {
    numOrder: number;
    codeOrder : string,
    description: string,
    supplement : string,
    type: string;
    dueDate: string; 
    taskList: Task[];
    startDateTime: string ; 
    leadTime: string ; 
    priority: number;
    status: string;
    doneAt : string ;
    createdAt : string
  }