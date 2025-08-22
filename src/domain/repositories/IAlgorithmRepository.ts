import { IProcessScheduler } from './IProcessScheduler';

export interface IAlgorithmRepository {
  getFCFSScheduler(): IProcessScheduler;
  getShortestProcessScheduler(): IProcessScheduler;
  getAllSchedulers(): Map<string, IProcessScheduler>;
}
