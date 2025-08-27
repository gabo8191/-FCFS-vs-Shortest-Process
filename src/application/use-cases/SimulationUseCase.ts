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

    this.state.schedulers.forEach((scheduler) => {
      scheduler.reset();
    });

    this.state.metrics.clear();

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

    this.state.schedulers.forEach((scheduler) => {
      scheduler.execute(timeStep, newTime);
    });

    const timeSinceLastGeneration = newTime - this.state.lastProcessGeneration;
    const generationIntervalMs =
      this.state.config.processGenerationInterval * 1000;

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
      const remainingProcesses =
        this.state.config.maxProcesses - this.state.totalProcessesGenerated;
      let numProcessesToGenerate;

      if (this.state.totalProcessesGenerated < 5) {
        numProcessesToGenerate = Math.min(2, remainingProcesses);
      } else if (this.state.totalProcessesGenerated < 15) {
        numProcessesToGenerate = Math.min(
          Math.random() > 0.5 ? 2 : 1,
          remainingProcesses
        );
      } else {
        numProcessesToGenerate = Math.min(1, remainingProcesses);
      }

      console.log(
        `🔄 Generating ${numProcessesToGenerate} processes at time ${newTime}ms (${this.state.totalProcessesGenerated}/${this.state.config.maxProcesses})`,
      );

      for (let i = 0; i < numProcessesToGenerate; i++) {
        const arrivalTimeOffset = i * (200 + Math.random() * 300);
        const baseProcess = ProcessGenerator.generateRandomProcess(
          this.state.config,
          newTime + arrivalTimeOffset,
        );

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

    const maxProcessesReached =
      this.state.totalProcessesGenerated >= this.state.config.maxProcesses;

    if (allProcessesCompleted && maxProcessesReached) {
      console.log(
        `Simulation complete: All ${this.state.totalProcessesGenerated} processes finished`,
      );
      this.state.isRunning = false;
    }

    if (newTime > 300000) {
      console.warn('Simulation timeout: Stopping after 5 minutes');
      this.state.isRunning = false;
    }

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
