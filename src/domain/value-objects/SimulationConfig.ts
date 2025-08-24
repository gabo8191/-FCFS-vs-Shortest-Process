export interface SimulationConfigData {
  processGenerationInterval: number; // segundos
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
    if (data.maxProcesses <= 0 || data.maxProcesses > 50) {
      throw new Error('Max processes must be between 1 and 50');
    }
  }

  // Getters
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

  // Immutable data access
  toData(): SimulationConfigData {
    return { ...this._data };
  }

  clone(): SimulationConfig {
    return new SimulationConfig({ ...this._data });
  }

  // Factory method for default configuration
  static createDefault(): SimulationConfig {
    return new SimulationConfig({
      processGenerationInterval: 4, // Más tiempo para evitar acumulación
      minBurstTime: 3, // Rango más estrecho y equilibrado
      maxBurstTime: 8, // Ratio 2.67:1 más justo
      minProcessSize: 10,
      maxProcessSize: 100,
      maxProcesses: 25, // Más procesos para mejor estadística
    });
  }

  // Configuración para favorecer FCFS (procesos similares)
  static createFCFSFriendly(): SimulationConfig {
    return new SimulationConfig({
      processGenerationInterval: 5, // Menos presión
      minBurstTime: 4, // Rango muy estrecho
      maxBurstTime: 6, // Ratio 1.5:1 - procesos similares
      minProcessSize: 20,
      maxProcessSize: 80,
      maxProcesses: 20,
    });
  }

  // Configuración para favorecer SJF (alta variabilidad)
  static createSJFFriendly(): SimulationConfig {
    return new SimulationConfig({
      processGenerationInterval: 2, // Más presión
      minBurstTime: 1, // Rango muy amplio
      maxBurstTime: 12, // Ratio 12:1 - alta variabilidad
      minProcessSize: 5,
      maxProcessSize: 150,
      maxProcesses: 30,
    });
  }

  // Configuración balanceada (la más equitativa)
  static createBalanced(): SimulationConfig {
    return new SimulationConfig({
      processGenerationInterval: 3,
      minBurstTime: 3, // Rango moderado
      maxBurstTime: 7, // Ratio 2.33:1 equilibrado
      minProcessSize: 15,
      maxProcessSize: 100,
      maxProcesses: 25,
    });
  }
}
