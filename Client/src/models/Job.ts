import { Client } from "./Client";
import { Resource } from "./Resource";
import { Task } from "./Task";

export interface Job {
    numOrder: number;
    codeOrder : string,
    client : Client,
    description: string,
    supplement : string,
    type: string;
    dueDate: string; 
    taskList: Task[];
    resource : Resource,
    startDateTime: string ; 
    leadTime: string ; 
    priority: number;
    status: string;
    doneAt : string ;
    createdAt : string
  }