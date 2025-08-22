import { AlgorithmMetrics } from '../entities/AlgorithmMetrics';
import { Process } from '../entities/Process';

export interface IProcessScheduler {
  addProcess(process: Process): void;
  execute(timeStep: number): void;
  reset(): void;
  getAllProcesses(): Process[];
  getCurrentState(): {
    runningProcess: Process | null;
    readyQueue: Process[];
    completedProcesses: Process[];
    currentTime: number;
  };
  getMetrics(currentTime: number): AlgorithmMetrics;
  getAlgorithmName(): string;
}
