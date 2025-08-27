import { AlgorithmMetrics } from '../../domain/entities/AlgorithmMetrics';
import { Process } from '../../domain/entities/Process';
import { IProcessScheduler } from '../../domain/repositories/IProcessScheduler';

export class SRTFScheduler implements IProcessScheduler {
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
      this.readyQueue.push(process);
      this.sortReadyQueue();
    } else {
      this.readyQueue.push(process);
      this.sortReadyQueue();
    }
  }

  private sortReadyQueue(): void {
    this.readyQueue.sort((a, b) => a.remainingTime - b.remainingTime);
  }

  execute(timeStep: number): void {
    this.currentTime += timeStep;

    this.readyQueue.forEach((process) => {
      if (process.arrivalTime <= this.currentTime && process.isWaiting()) {
        process.setReady();
      }
    });

    const availableProcesses = this.readyQueue.filter(
      (p) => p.arrivalTime <= this.currentTime && p.isReady(),
    );

    this.checkPreemption(availableProcesses);

    if (this.runningProcess && this.runningProcess.isRunning()) {
      this.runningProcess.execute(timeStep);

      if (this.runningProcess.remainingTime <= 0) {
        this.runningProcess.complete(this.currentTime);
        this.completedProcesses.push(this.runningProcess);
        this.runningProcess = null;
      }
    }

    if (!this.runningProcess && availableProcesses.length > 0) {
      const shortestJob = availableProcesses.reduce((shortest, current) =>
        current.remainingTime < shortest.remainingTime ? current : shortest,
      );

      const index = this.readyQueue.indexOf(shortestJob);
      if (index > -1) {
        this.readyQueue.splice(index, 1);
      }

      this.runningProcess = shortestJob;
      if (!this.runningProcess.isRunning()) {
        this.runningProcess.start(this.currentTime);
      }
    }
  }

  private checkPreemption(availableProcesses: Process[]): void {
    if (!this.runningProcess || !this.runningProcess.isRunning()) {
      return;
    }

    if (availableProcesses.length === 0) {
      return;
    }

    const shortestInQueue = availableProcesses.reduce((shortest, current) =>
      current.remainingTime < shortest.remainingTime ? current : shortest,
    );

    if (shortestInQueue.remainingTime < this.runningProcess.remainingTime) {
      this.runningProcess.setReady();
      this.readyQueue.push(this.runningProcess);

      const index = this.readyQueue.indexOf(shortestInQueue);
      if (index > -1) {
        this.readyQueue.splice(index, 1);
      }

      this.runningProcess = shortestInQueue;

      if (!this.runningProcess.isRunning()) {
        this.runningProcess.start(this.currentTime);
      }

      this.sortReadyQueue();
    }
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
    return 'SRTF (Shortest Remaining Time First)';
  }
}
