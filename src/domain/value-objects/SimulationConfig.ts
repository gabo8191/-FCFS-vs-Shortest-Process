export interface SimulationConfigData {
  processGenerationInterval: number;
  minBurstTime: number;
  maxBurstTime: number;
  minProcessSize: number;
  maxProcessSize: number;
  maxProcesses: number;
}

export class SimulationConfig {
  private _data: SimulationConfigData;

  constructor(data: SimulationConfigData) {
    this.validateConfig(data);
    this._data = { ...data };
  }

  private validateConfig(data: SimulationConfigData): void {
    if (
      data.processGenerationInterval <= 0 ||
      data.processGenerationInterval > 10
    ) {
      throw new Error(
        'Process generation interval must be between 1 and 10 seconds',
      );
    }
    if (data.minBurstTime <= 0 || data.maxBurstTime <= 0) {
      throw new Error('Burst times must be greater than 0');
    }
    if (data.minBurstTime >= data.maxBurstTime) {
      throw new Error('Min burst time must be less than max burst time');
    }
    if (data.minProcessSize <= 0 || data.maxProcessSize <= 0) {
      throw new Error('Process sizes must be greater than 0');
    }
    if (data.minProcessSize >= data.maxProcessSize) {
      throw new Error('Min process size must be less than max process size');
    }
    if (data.maxProcesses <= 0) {
      throw new Error('Max processes must be greater than 0');
    }
  }

  get processGenerationInterval(): number {
    return this._data.processGenerationInterval;
  }
  get minBurstTime(): number {
    return this._data.minBurstTime;
  }
  get maxBurstTime(): number {
    return this._data.maxBurstTime;
  }
  get minProcessSize(): number {
    return this._data.minProcessSize;
  }
  get maxProcessSize(): number {
    return this._data.maxProcessSize;
  }
  get maxProcesses(): number {
    return this._data.maxProcesses;
  }

  toData(): SimulationConfigData {
    return { ...this._data };
  }

  clone(): SimulationConfig {
    return new SimulationConfig({ ...this._data });
  }

  static createDefault(): SimulationConfig {
    return new SimulationConfig({
      processGenerationInterval: 3,
      minBurstTime: 1000,
      maxBurstTime: 8000,
      minProcessSize: 10,
      maxProcessSize: 100,
      maxProcesses: 20,
    });
  }

  static createFCFSFriendly(): SimulationConfig {
    return new SimulationConfig({
      processGenerationInterval: 4,
      minBurstTime: 3000,
      maxBurstTime: 4000,
      minProcessSize: 20,
      maxProcessSize: 80,
        maxProcesses: 12,
    });
  }

  static createSJFFriendly(): SimulationConfig {
    return new SimulationConfig({
      processGenerationInterval: 2,
      minBurstTime: 500,
      maxBurstTime: 10000,
      minProcessSize: 5,
      maxProcessSize: 150,
      maxProcesses: 25,
    });
  }

  static createDemonstration(): SimulationConfig {
    return new SimulationConfig({
      processGenerationInterval: 2.5,
      minBurstTime: 800,
      maxBurstTime: 12000,
      minProcessSize: 10,
      maxProcessSize: 120,
      maxProcesses: 18,
    });
  }

  static createBalanced(): SimulationConfig {
    return new SimulationConfig({
      processGenerationInterval: 3,
      minBurstTime: 2000,
      maxBurstTime: 6000,
      minProcessSize: 15,
      maxProcessSize: 100,
      maxProcesses: 15,
    });
  }
}
