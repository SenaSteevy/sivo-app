import { Client } from "./Client";
import { Job } from "./Job";
import { Treatment } from "./Treatment";

export interface Task {
    id: number;
    numOrder: number | undefined;
    client : Client;
    treatment: Treatment;
    status: string;
    startTime: string | undefined; 
    realStartTime: string | undefined;
  }