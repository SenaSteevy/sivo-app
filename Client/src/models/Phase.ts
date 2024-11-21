import { Timeslot } from "./Timeslot";

export interface Phase {
    id: number;
    name: string;
    capacity: number;
    duration: string; 
    taskList: Task[];
    timeslotList : Timeslot[]
  }

export { Timeslot };
