import { AlgorithmMetrics } from '../entities/AlgorithmMetrics';
import { IProcessScheduler } from './IProcessScheduler';

export interface IAlgorithmRepository {
  getFCFSScheduler(): IProcessScheduler;
  getSJFScheduler(): IProcessScheduler;
  getSRTFScheduler(): IProcessScheduler;

  getMetrics(algorithmName: string): AlgorithmMetrics | undefined;
  setMetrics(algorithmName: string, metrics: AlgorithmMetrics): void;
  resetMetrics(): void;
}
