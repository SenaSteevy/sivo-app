import { Job } from "./Job";
import { Treatment } from "./Treatment";

export interface Task {
    id: number;
    numOrder: number | undefined;
    treatment: Treatment;
    status: string;
    startTime: string | undefined; 
    realStartTime: string | undefined;
  }