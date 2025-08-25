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
    if (data.maxProcesses <= 0) {
      throw new Error('Max processes must be greater than 0');
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
      processGenerationInterval: 3, // Generate processes every 3 seconds
      minBurstTime: 1000,
      maxBurstTime: 8000, // Increased range for better differentiation
      minProcessSize: 10,
      maxProcessSize: 100,
      maxProcesses: 20, // More processes to see patterns
    });
  }

  // Configuración para favorecer FCFS (procesos similares)
  static createFCFSFriendly(): SimulationConfig {
    return new SimulationConfig({
      processGenerationInterval: 4, // Llegadas más espaciadas
      minBurstTime: 3000, // Rango estrecho - procesos similares
      maxBurstTime: 4000, // Ratio 1.33:1 - muy poca variabilidad
      minProcessSize: 20,
      maxProcessSize: 80,
      maxProcesses: 12, // Menos procesos para observar mejor
    });
  }

  // Configuración para favorecer SJF/SRTF (alta variabilidad)
  static createSJFFriendly(): SimulationConfig {
    return new SimulationConfig({
      processGenerationInterval: 2, // Llegadas más frecuentes
      minBurstTime: 500, // Rango muy amplio
      maxBurstTime: 10000, // Ratio 20:1 - alta variabilidad
      minProcessSize: 5,
      maxProcessSize: 150,
      maxProcesses: 25, // Más procesos para ver el efecto
    });
  }

  // Configuración IDEAL para demostrar diferencias claras
  static createDemonstration(): SimulationConfig {
    return new SimulationConfig({
      processGenerationInterval: 2.5, // Balance entre observación y rapidez
      minBurstTime: 800, // Rango muy amplio para mostrar diferencias
      maxBurstTime: 12000, // Ratio 15:1 - excelente para comparaciones
      minProcessSize: 10,
      maxProcessSize: 120,
      maxProcesses: 18, // Suficientes para ver patrones claros
    });
  }

  // Configuración balanceada (la más equitativa)
  static createBalanced(): SimulationConfig {
    return new SimulationConfig({
      processGenerationInterval: 3,
      minBurstTime: 2000, // Rango moderado
      maxBurstTime: 6000, // Ratio 3:1 equilibrado
      minProcessSize: 15,
      maxProcessSize: 100,
      maxProcesses: 15,
    });
  }
}
