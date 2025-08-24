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
    // Only add processes that have arrived
    if (process.arrivalTime <= this.currentTime) {
      this.readyQueue.push(process);
      this.sortReadyQueue();
    } else {
      // Store processes that haven't arrived yet (for proper arrival handling)
      // For now, just add them to ready queue - arrival time will be handled in execute
      this.readyQueue.push(process);
      this.sortReadyQueue();
    }
  }

  private sortReadyQueue(): void {
    this.readyQueue.sort((a, b) => a.remainingTime - b.remainingTime);
  }

  execute(timeStep: number): void {
    this.currentTime += timeStep;

    // Move arrived processes from waiting to ready
    this.readyQueue.forEach((process) => {
      if (process.arrivalTime <= this.currentTime && process.isWaiting()) {
        process.setReady();
      }
    });

    // Only consider processes that have actually arrived and are ready
    const availableProcesses = this.readyQueue.filter(
      (p) => p.arrivalTime <= this.currentTime && p.isReady(),
    );

    // Check for preemption before executing current process
    this.checkPreemption(availableProcesses);

    // Execute current running process
    if (this.runningProcess && this.runningProcess.isRunning()) {
      this.runningProcess.execute(timeStep);

      if (this.runningProcess.remainingTime <= 0) {
        this.runningProcess.complete(this.currentTime);
        this.completedProcesses.push(this.runningProcess);
        this.runningProcess = null;
      }
    }

    // If no process is running, select the shortest available process
    if (!this.runningProcess && availableProcesses.length > 0) {
      const shortestJob = availableProcesses.reduce((shortest, current) =>
        current.remainingTime < shortest.remainingTime ? current : shortest,
      );

      // Remove from ready queue
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

    // Only preempt if there's a significantly shorter process
    if (shortestInQueue.remainingTime < this.runningProcess.remainingTime) {
      // Move current running process back to ready queue
      this.runningProcess.setReady();
      this.readyQueue.push(this.runningProcess);

      // Remove the new process from ready queue
      const index = this.readyQueue.indexOf(shortestInQueue);
      if (index > -1) {
        this.readyQueue.splice(index, 1);
      }

      // Set the new running process
      this.runningProcess = shortestInQueue;

      // Start the new process if it hasn't been started yet
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
