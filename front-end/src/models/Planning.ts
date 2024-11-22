import { Job } from "./Job";

export interface Planning {
    id: number;
    jobList: Job[];
    rxRate: number;
    dueDateRate: number;
    createdAt: string;
  }
  