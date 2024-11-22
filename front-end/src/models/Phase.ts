import { Timeslot } from "./Timeslot";
import { Task } from "./Task";

export interface Phase {
    id: number;
    name: string;
    capacity: number;
    duration: string; 
    taskList: Task[];
    timeslotList : Timeslot[]
  }

export { Timeslot };
