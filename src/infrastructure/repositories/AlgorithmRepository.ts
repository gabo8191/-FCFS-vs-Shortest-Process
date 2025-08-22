import { IAlgorithmRepository } from '../../domain/repositories/IAlgorithmRepository';
import { IProcessScheduler } from '../../domain/repositories/IProcessScheduler';
import { FCFSScheduler } from '../algorithms/FCFSScheduler';
import { ShortestProcessScheduler } from '../algorithms/ShortestProcessScheduler';

export class AlgorithmRepository implements IAlgorithmRepository {
  private schedulers: Map<string, IProcessScheduler>;

  constructor() {
    this.schedulers = new Map();
    this.schedulers.set('FCFS', new FCFSScheduler());
    this.schedulers.set('SP', new ShortestProcessScheduler());
  }

  getFCFSScheduler(): IProcessScheduler {
    return this.schedulers.get('FCFS')!;
  }

  getShortestProcessScheduler(): IProcessScheduler {
    return this.schedulers.get('SP')!;
  }

  getAllSchedulers(): Map<string, IProcessScheduler> {
    return new Map(this.schedulers);
  }
}
