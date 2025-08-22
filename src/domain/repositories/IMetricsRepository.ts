import { AlgorithmMetrics } from '../entities/AlgorithmMetrics';

export interface IMetricsRepository {
  saveMetrics(algorithmName: string, metrics: AlgorithmMetrics): Promise<void>;
  getMetrics(algorithmName: string): Promise<AlgorithmMetrics | null>;
  getAllMetrics(): Promise<Map<string, AlgorithmMetrics>>;
  clearMetrics(): Promise<void>;
}
