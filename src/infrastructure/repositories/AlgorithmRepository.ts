import { AlgorithmMetrics } from '../../domain/entities/AlgorithmMetrics';
import { IAlgorithmRepository } from '../../domain/repositories/IAlgorithmRepository';
import { IProcessScheduler } from '../../domain/repositories/IProcessScheduler';
import { FCFSScheduler } from '../algorithms/FCFSScheduler';
import { SJFScheduler } from '../algorithms/SJFScheduler';
import { SRTFScheduler } from '../algorithms/SRTFScheduler';

export class AlgorithmRepository implements IAlgorithmRepository {
  private schedulers: Map<string, IProcessScheduler>;
  private metrics: Map<string, AlgorithmMetrics>;

  constructor() {
    this.schedulers = new Map();
    this.metrics = new Map();
    this.schedulers.set('FCFS', new FCFSScheduler());
    this.schedulers.set('SJF', new SJFScheduler());
    this.schedulers.set('SRTF', new SRTFScheduler());
  }

  getFCFSScheduler(): IProcessScheduler {
    return this.schedulers.get('FCFS')!;
  }

  getSJFScheduler(): IProcessScheduler {
    return this.schedulers.get('SJF')!;
  }

  getSRTFScheduler(): IProcessScheduler {
    return this.schedulers.get('SRTF')!;
  }

  getMetrics(algorithmName: string): AlgorithmMetrics | undefined {
    return this.metrics.get(algorithmName);
  }

  setMetrics(algorithmName: string, metrics: AlgorithmMetrics): void {
    this.metrics.set(algorithmName, metrics);
  }

  resetMetrics(): void {
    this.metrics.clear();
  }

  getAllSchedulers(): Map<string, IProcessScheduler> {
    return new Map(this.schedulers);
  }
}
