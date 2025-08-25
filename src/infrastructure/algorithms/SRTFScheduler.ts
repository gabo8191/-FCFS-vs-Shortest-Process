import { AlgorithmMetrics } from '../../domain/entities/AlgorithmMetrics';
import { Process } from '../../domain/entities/Process';
import { IProcessScheduler } from '../../domain/repositories/IProcessScheduler';

export class SRTFScheduler implements IProcessScheduler {
  private readyQueue: Process[] = [];
  private waitingQueue: Process[] = []; // Processes that haven't arrived yet
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
    // Add to appropriate queue based on arrival time
    if (process.arrivalTime <= this.currentTime) {
      process.setReady();
      this.readyQueue.push(process);
      this.sortReadyQueue();
    } else {
      process.setWaiting();
      this.waitingQueue.push(process);
      // Sort waiting queue by arrival time
      this.waitingQueue.sort((a, b) => a.arrivalTime - b.arrivalTime);
    }
  }

  private sortReadyQueue(): void {
    this.readyQueue.sort((a, b) => a.remainingTime - b.remainingTime);
  }

  execute(timeStep: number, globalTime?: number): void {
    // Use global time if provided, otherwise increment local time
    if (globalTime !== undefined) {
      this.currentTime = globalTime;
    } else {
      this.currentTime += timeStep;
    }

    // Move arrived processes from waiting queue to ready queue
    const arrivedProcesses = this.waitingQueue.filter(
      (process) => process.arrivalTime <= this.currentTime,
    );

    arrivedProcesses.forEach((process) => {
      // Remove from waiting queue
      const index = this.waitingQueue.indexOf(process);
      if (index > -1) {
        this.waitingQueue.splice(index, 1);
      }

      // Add to ready queue
      process.setReady();
      this.readyQueue.push(process);
    });

    // Re-sort ready queue after adding new processes
    this.sortReadyQueue();

    // Check for preemption before executing current process
    this.checkPreemption();

    // Execute current running process
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

    // If no process is running, select the shortest available process
    if (!this.runningProcess) {
      const availableProcesses = this.readyQueue.filter(
        (p) =>
          p.arrivalTime <= this.currentTime && (p.isReady() || p.isWaiting()),
      );

      if (availableProcesses.length > 0) {
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
  }

  private checkPreemption(): void {
    if (!this.runningProcess) {
      return;
    }

    // All processes in readyQueue should already be available (arrived and ready)
    const availableProcesses = this.readyQueue;

    if (availableProcesses.length === 0) {
      return;
    }

    const shortestInQueue = availableProcesses.reduce((shortest, current) =>
      current.remainingTime < shortest.remainingTime ? current : shortest,
    );

    // SRTF Rule: Preempt if ANY process has shorter remaining time
    // No artificial thresholds - pure algorithm implementation
    if (shortestInQueue.remainingTime < this.runningProcess.remainingTime) {
      console.log(
        `🔄 SRTF Preemption: ${this.runningProcess.name} (${this.runningProcess.remainingTime}ms) → ${shortestInQueue.name} (${shortestInQueue.remainingTime}ms)`,
      );

      // Move current process back to ready queue
      this.runningProcess.setReady();
      this.readyQueue.push(this.runningProcess);

      // Remove the new process from ready queue
      const index = this.readyQueue.indexOf(shortestInQueue);
      if (index > -1) {
        this.readyQueue.splice(index, 1);
      }

      // Set new running process
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
