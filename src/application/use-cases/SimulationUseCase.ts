import { AlgorithmMetrics } from '../../domain/entities/AlgorithmMetrics';
import { Process } from '../../domain/entities/Process';
import { IProcessScheduler } from '../../domain/repositories/IProcessScheduler';
import { SimulationConfig } from '../../domain/value-objects/SimulationConfig';
import { ProcessGenerator } from '../../infrastructure/generators/ProcessGenerator';

export interface SimulationState {
  isRunning: boolean;
  currentTime: number;
  config: SimulationConfig;
  lastProcessGeneration: number;
  totalProcessesGenerated: number;
  schedulers: Map<string, IProcessScheduler>;
  metrics: Map<string, AlgorithmMetrics>;
}

export class SimulationUseCase {
  private state: SimulationState;

  constructor(schedulers: IProcessScheduler[]) {
    this.state = {
      isRunning: false,
      currentTime: 0,
      config: SimulationConfig.createDefault(),
      lastProcessGeneration: 0,
      totalProcessesGenerated: 0,
      schedulers: new Map(),
      metrics: new Map(),
    };

    // Initialize schedulers
    schedulers.forEach((scheduler) => {
      this.state.schedulers.set(scheduler.getAlgorithmName(), scheduler);
    });
  }

  startSimulation(): void {
    this.state.isRunning = true;
  }

  pauseSimulation(): void {
    this.state.isRunning = false;
  }

  resetSimulation(): void {
    this.state.isRunning = false;
    this.state.currentTime = 0;
    this.state.lastProcessGeneration = 0;
    this.state.totalProcessesGenerated = 0;

    // Reset all schedulers
    this.state.schedulers.forEach((scheduler) => {
      scheduler.reset();
    });

    // Reset metrics
    this.state.metrics.clear();

    // Reset process generator counter
    import('../../infrastructure/generators/ProcessGenerator').then(
      ({ ProcessGenerator }) => {
        ProcessGenerator.resetIdCounter();
      },
    );
  }

  updateConfig(config: SimulationConfig): void {
    this.state.config = config;
  }

  executeStep(timeStep: number): void {
    if (!this.state.isRunning) {
      return;
    }

    const newTime = this.state.currentTime + timeStep;

    // Execute all schedulers
    this.state.schedulers.forEach((scheduler) => {
      scheduler.execute(timeStep);
    });

    // Generate new processes if needed
    const timeSinceLastGeneration = newTime - this.state.lastProcessGeneration;
    if (
      timeSinceLastGeneration >=
        this.state.config.processGenerationInterval * 1000 &&
      this.state.totalProcessesGenerated < this.state.config.maxProcesses
    ) {
      // Generate multiple processes at once to create more realistic scenarios
      const numProcessesToGenerate = Math.min(
        3, // Generate up to 3 processes at once
        this.state.config.maxProcesses - this.state.totalProcessesGenerated,
      );

      for (let i = 0; i < numProcessesToGenerate; i++) {
        const newProcess = ProcessGenerator.generateRandomProcess(
          this.state.config,
          newTime + i * 100, // Small offset to avoid exact same arrival time
        );

        // Add process to all schedulers
        this.state.schedulers.forEach((scheduler) => {
          scheduler.addProcess(newProcess.clone());
        });

        this.state.totalProcessesGenerated += 1;
      }

      this.state.lastProcessGeneration = newTime;
    }

    // Check if all processes are completed and stop simulation
    const allProcessesCompleted = Array.from(
      this.state.schedulers.values(),
    ).every((scheduler) => {
      const processes = scheduler.getAllProcesses();
      return (
        processes.length > 0 && processes.every((p) => p.status === 'completed')
      );
    });

    if (
      allProcessesCompleted &&
      this.state.totalProcessesGenerated >= this.state.config.maxProcesses
    ) {
      this.state.isRunning = false;
    }

    // Calculate metrics for all schedulers
    this.state.schedulers.forEach((scheduler) => {
      const metrics = scheduler.getMetrics(newTime);
      this.state.metrics.set(scheduler.getAlgorithmName(), metrics);
    });

    this.state.currentTime = newTime;
  }

  getState(): SimulationState {
    return {
      ...this.state,
      schedulers: new Map(this.state.schedulers),
      metrics: new Map(this.state.metrics),
    };
  }

  getScheduler(algorithmName: string): IProcessScheduler | undefined {
    return this.state.schedulers.get(algorithmName);
  }

  getMetrics(algorithmName: string): AlgorithmMetrics | undefined {
    return this.state.metrics.get(algorithmName);
  }

  getAllProcesses(algorithmName: string): Process[] {
    const scheduler = this.state.schedulers.get(algorithmName);
    return scheduler ? scheduler.getAllProcesses() : [];
  }
}
