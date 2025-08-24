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
    const generationIntervalMs =
      this.state.config.processGenerationInterval * 200; // Much faster generation - every 400ms for 2 second config

    console.log('🔍 Process Generation Check:', {
      newTime,
      lastGeneration: this.state.lastProcessGeneration,
      timeSince: timeSinceLastGeneration,
      intervalNeeded: generationIntervalMs,
      totalGenerated: this.state.totalProcessesGenerated,
      maxProcesses: this.state.config.maxProcesses,
      shouldGenerate:
        timeSinceLastGeneration >= generationIntervalMs &&
        this.state.totalProcessesGenerated < this.state.config.maxProcesses,
    });

    if (
      timeSinceLastGeneration >= generationIntervalMs &&
      this.state.totalProcessesGenerated < this.state.config.maxProcesses
    ) {
      // Generate more processes aggressively
      const remainingProcesses =
        this.state.config.maxProcesses - this.state.totalProcessesGenerated;
      let numProcessesToGenerate;

      if (this.state.totalProcessesGenerated < 8) {
        // Generate 3-5 processes at the beginning
        numProcessesToGenerate = Math.min(5, remainingProcesses);
      } else if (this.state.totalProcessesGenerated < 15) {
        // Generate 2-3 processes in the middle
        numProcessesToGenerate = Math.min(3, remainingProcesses);
      } else {
        // Generate 1-2 processes at the end
        numProcessesToGenerate = Math.min(1, remainingProcesses);
      }

      console.log(
        `🔄 Generating ${numProcessesToGenerate} processes at time ${newTime}ms (${this.state.totalProcessesGenerated}/${this.state.config.maxProcesses})`,
      );

      for (let i = 0; i < numProcessesToGenerate; i++) {
        // Generate a base process with proper ID management
        const baseProcess = ProcessGenerator.generateRandomProcess(
          this.state.config,
          newTime + i * 50, // Smaller offset for more realistic arrival times
        );

        // Create independent copies for each scheduler
        this.state.schedulers.forEach((scheduler) => {
          const processForScheduler = baseProcess.clone();
          scheduler.addProcess(processForScheduler);
        });

        this.state.totalProcessesGenerated += 1;
      }

      console.log(
        `Generated ${numProcessesToGenerate} processes. Total: ${this.state.totalProcessesGenerated}/${this.state.config.maxProcesses}`,
      );
      this.state.lastProcessGeneration = newTime;
    }

    // Check if all processes are completed and stop simulation
    const allSchedulersHaveProcesses = Array.from(
      this.state.schedulers.values(),
    ).every((scheduler) => scheduler.getAllProcesses().length > 0);

    const allProcessesCompleted =
      allSchedulersHaveProcesses &&
      Array.from(this.state.schedulers.values()).every((scheduler) => {
        const processes = scheduler.getAllProcesses();
        return processes.every(
          (p) => p.isCompleted() || p.status === 'completed',
        );
      });

    // Only stop if we've reached max processes AND all are completed
    const maxProcessesReached =
      this.state.totalProcessesGenerated >= this.state.config.maxProcesses;

    if (allProcessesCompleted && maxProcessesReached) {
      console.log(
        `Simulation complete: All ${this.state.totalProcessesGenerated} processes finished`,
      );
      this.state.isRunning = false;
    }

    // Safety check: if simulation runs too long, stop it
    if (newTime > 300000) {
      // 5 minutes max
      console.warn('Simulation timeout: Stopping after 5 minutes');
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
