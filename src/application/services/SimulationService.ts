import { Process } from '../../domain/entities/Process';
import { IProcessScheduler } from '../../domain/repositories/IProcessScheduler';

export class SimulationService {
  constructor(
    private fcfsScheduler: IProcessScheduler,
    private spScheduler: IProcessScheduler,
  ) {}

  startSimulation(): void {
    this.fcfsScheduler.reset();
    this.spScheduler.reset();
  }

  pauseSimulation(): void {
    // Implementation for pausing
  }

  resetSimulation(): void {
    this.fcfsScheduler.reset();
    this.spScheduler.reset();
  }

  executeStep(timeStep: number): void {
    this.fcfsScheduler.execute(timeStep);
    this.spScheduler.execute(timeStep);
  }

  addProcess(process: Process): void {
    this.fcfsScheduler.addProcess(process);
    this.spScheduler.addProcess(process);
  }

  getFCFSScheduler(): IProcessScheduler {
    return this.fcfsScheduler;
  }

  getSPScheduler(): IProcessScheduler {
    return this.spScheduler;
  }
}
