import { AlgorithmMetrics } from '../../domain/entities/AlgorithmMetrics';
import { Process } from '../../domain/entities/Process';
import { IProcessScheduler } from '../../domain/repositories/IProcessScheduler';

export class SRTFScheduler implements IProcessScheduler {
  private readyQueue: Process[] = [];
  private waitingQueue: Process[] = [];
  private runningProcess: Process | null = null;
  private completedProcesses: Process[] = [];
  private currentTime = 0;

  constructor() {
    this.reset();
  }

  reset(): void {
    this.readyQueue = [];
    this.waitingQueue = [];
    this.runningProcess = null;
    this.completedProcesses = [];
    this.currentTime = 0;
  }

  addProcess(process: Process): void {
    if (process.arrivalTime <= this.currentTime) {
      process.setReady();
      this.readyQueue.push(process);
      this.sortReadyQueue();
    } else {
      process.setWaiting();
      this.waitingQueue.push(process);
      this.waitingQueue.sort((a, b) => a.arrivalTime - b.arrivalTime);
    }
  }

  private sortReadyQueue(): void {
    this.readyQueue.sort((a, b) => a.remainingTime - b.remainingTime);
  }

  execute(timeStep: number, globalTime?: number): void {
    if (globalTime !== undefined) {
      this.currentTime = globalTime;
    } else {
      this.currentTime += timeStep;
    }

    const arrivedProcesses = this.waitingQueue.filter(
      (process) => process.arrivalTime <= this.currentTime,
    );

    arrivedProcesses.forEach((process) => {
      const index = this.waitingQueue.indexOf(process);
      if (index > -1) {
        this.waitingQueue.splice(index, 1);
      }

      process.setReady();
      this.readyQueue.push(process);
    });

    this.sortReadyQueue();

    this.checkPreemption();

    if (this.runningProcess) {
      if (!this.runningProcess.isRunning()) {
        console.warn(
          `SRTF: Process ${this.runningProcess.name} is not running, setting to running`,
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
        (p) =>
          p.arrivalTime <= this.currentTime && (p.isReady() || p.isWaiting()),
      );

      if (availableProcesses.length > 0) {
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
  }

  private checkPreemption(): void {
    if (!this.runningProcess) {
      return;
    }

    const availableProcesses = this.readyQueue;

    if (availableProcesses.length === 0) {
      return;
    }

    const shortestInQueue = availableProcesses.reduce((shortest, current) =>
      current.remainingTime < shortest.remainingTime ? current : shortest,
    );

    if (shortestInQueue.remainingTime < this.runningProcess.remainingTime) {
      console.log(
        `🔄 SRTF Preemption: ${this.runningProcess.name} (${this.runningProcess.remainingTime}ms) → ${shortestInQueue.name} (${shortestInQueue.remainingTime}ms)`,
      );

      this.runningProcess.setReady();
      this.readyQueue.push(this.runningProcess);

      const index = this.readyQueue.indexOf(shortestInQueue);
      if (index > -1) {
        this.readyQueue.splice(index, 1);
      }

      this.runningProcess = shortestInQueue;
      this.runningProcess.start(this.currentTime);

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
      ...this.waitingQueue,
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
    return 'SRTF (Shortest Remaining Time First - Preemptive)';
  }
}
