import { IProcessScheduler } from '../../../domain/repositories/IProcessScheduler';

export class StartSimulation {
  constructor(
    private fcfsScheduler: IProcessScheduler,
    private spScheduler: IProcessScheduler,
  ) {}

  execute(): void {
    this.fcfsScheduler.reset();
    this.spScheduler.reset();
  }
}
