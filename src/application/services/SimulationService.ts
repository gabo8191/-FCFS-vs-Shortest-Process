import { Process } from '../../domain/entities/Process';
import { IProcessScheduler } from '../../domain/repositories/IProcessScheduler';

export class SimulationService {
  constructor(
    private fcfsScheduler: IProcessScheduler,
    private sjfScheduler: IProcessScheduler,
    private srtfScheduler: IProcessScheduler,
  ) {}

  startSimulation(): void {
    this.fcfsScheduler.reset();
    this.sjfScheduler.reset();
    this.srtfScheduler.reset();
  }

  pauseSimulation(): void {
    // Implementation for pausing
  }

  resetSimulation(): void {
    this.fcfsScheduler.reset();
    this.sjfScheduler.reset();
    this.srtfScheduler.reset();
  }

  executeStep(timeStep: number): void {
    this.fcfsScheduler.execute(timeStep);
    this.sjfScheduler.execute(timeStep);
    this.srtfScheduler.execute(timeStep);
  }

  addProcess(process: Process): void {
    this.fcfsScheduler.addProcess(process);
    this.sjfScheduler.addProcess(process);
    this.srtfScheduler.addProcess(process);
  }

  getFCFSScheduler(): IProcessScheduler {
    return this.fcfsScheduler;
  }

  getSJFScheduler(): IProcessScheduler {
    return this.sjfScheduler;
  }

  getSRTFScheduler(): IProcessScheduler {
    return this.srtfScheduler;
  }
}
