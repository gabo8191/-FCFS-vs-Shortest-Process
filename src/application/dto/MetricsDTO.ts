export interface MetricsDTO {
  algorithmName: string;
  averageWaitingTime: number;
  averageTurnaroundTime: number;
  throughput: number;
  cpuUtilization: number;
  totalProcesses: number;
  completedProcesses: number;
}
