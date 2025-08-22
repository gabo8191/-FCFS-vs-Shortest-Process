export interface ProcessDTO {
  id: string;
  name: string;
  arrivalTime: number;
  burstTime: number;
  size: number;
  status: string;
  remainingTime: number;
  startTime?: number;
  endTime?: number;
  waitingTime?: number;
  turnaroundTime?: number;
}
