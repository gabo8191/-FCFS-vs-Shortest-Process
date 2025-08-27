import { AlgorithmMetrics } from '../../domain/entities/AlgorithmMetrics';
import { Process } from '../../domain/entities/Process';
import { IProcessScheduler } from '../../domain/repositories/IProcessScheduler';

export class SJFScheduler implements IProcessScheduler {
  private readyQueue: Process[] = [];
  private runningProcess: Process | null = null;
  private completedProcesses: Process[] = [];
  private currentTime = 0;

  constructor() {
    this.reset();
  }

  reset(): void {
    this.readyQueue = [];
    this.runningProcess = null;
    this.completedProcesses = [];
    this.currentTime = 0;
  }

  addProcess(process: Process): void {
    if (process.arrivalTime <= this.currentTime) {
      process.setReady();
    } else {
      process.setWaiting();
    }
    this.readyQueue.push(process);
    this.readyQueue.sort((a, b) => a.arrivalTime - b.arrivalTime);
  }

  execute(timeStep: number, globalTime?: number): void {
    if (globalTime !== undefined) {
      this.currentTime = globalTime;
    } else {
      this.currentTime += timeStep;
    }

    if (this.runningProcess) {
      if (!this.runningProcess.isRunning()) {
        console.warn(
          `SJF: Process ${this.runningProcess.name} is not running, setting to running`,
        );
        this.runningProcess.start(this.currentTime);
      }

      this.runningProcess.execute(timeStep);

      if (this.runningProcess.remainingTime <= 0) {
        this.runningProcess.complete(this.currentTime);
        this.completedProcesses.push(this.runningProcess);
        this.runningProcess = null;
      }
    }

    if (!this.runningProcess) {
      const availableProcesses = this.readyQueue.filter(
        (p) => p.arrivalTime <= this.currentTime && p.isReady()
      );

      if (availableProcesses.length > 0) {
        const shortestJob = availableProcesses.reduce((shortest, current) =>
          current.burstTime < shortest.burstTime ? current : shortest,
        );

        const index = this.readyQueue.indexOf(shortestJob);
        if (index > -1) {
          this.readyQueue.splice(index, 1);
        }

        this.runningProcess = shortestJob;
        this.runningProcess.start(this.currentTime);
      }
    }

    this.readyQueue.forEach((process) => {
      if (process.arrivalTime <= this.currentTime && process.isWaiting()) {
        process.setReady();
      }
    });
  }

  getCurrentState(): {
    runningProcess: Process | null;
    readyQueue: Process[];
    completedProcesses: Process[];
    currentTime: number;
  } {
    return {
      runningProcess: this.runningProcess,
      readyQueue: this.readyQueue,
      completedProcesses: this.completedProcesses,
      currentTime: this.currentTime,
    };
  }

  getAllProcesses(): Process[] {
    return [
      ...(this.runningProcess ? [this.runningProcess] : []),
      ...this.readyQueue,
      ...this.completedProcesses,
    ];
  }

  getMetrics(currentTime: number): AlgorithmMetrics {
    return AlgorithmMetrics.calculateFromProcesses(
      this.getAllProcesses(),
      currentTime,
    );
  }

  getAlgorithmName(): string {
    return 'SJF (Shortest Job First - Non-Preemptive)';
  }
}
