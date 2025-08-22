export interface AlgorithmMetricsData {
  totalProcesses: number;
  averageWaitingTime: number;
  averageTurnaroundTime: number;
  throughput: number;
  cpuUtilization: number;
  totalExecutionTime: number;
}

export class AlgorithmMetrics {
  private _data: AlgorithmMetricsData;

  constructor(data: AlgorithmMetricsData) {
    this._data = { ...data };
  }

  // Getters
  get totalProcesses(): number {
    return this._data.totalProcesses;
  }
  get averageWaitingTime(): number {
    return this._data.averageWaitingTime;
  }
  get averageTurnaroundTime(): number {
    return this._data.averageTurnaroundTime;
  }
  get throughput(): number {
    return this._data.throughput;
  }
  get cpuUtilization(): number {
    return this._data.cpuUtilization;
  }
  get totalExecutionTime(): number {
    return this._data.totalExecutionTime;
  }

  // Business methods
  static calculateFromProcesses(
    processes: any[],
    currentTime: number,
  ): AlgorithmMetrics {
    const completedProcesses = processes.filter(
      (p) => p.isCompleted?.() || p.status === 'completed',
    );

    if (completedProcesses.length === 0) {
      return new AlgorithmMetrics({
        totalProcesses: processes.length,
        averageWaitingTime: 0,
        averageTurnaroundTime: 0,
        throughput: 0,
        cpuUtilization: 0,
        totalExecutionTime: currentTime,
      });
    }

    const totalWaitingTime = completedProcesses.reduce((sum, process) => {
      const waitingTime = process.waitingTime || 0;
      return sum + waitingTime;
    }, 0);

    const totalTurnaroundTime = completedProcesses.reduce((sum, process) => {
      const turnaroundTime = process.turnaroundTime || 0;
      return sum + turnaroundTime;
    }, 0);

    const totalBurstTime = completedProcesses.reduce((sum, process) => {
      return sum + (process.burstTime || 0);
    }, 0);

    const averageWaitingTime = totalWaitingTime / completedProcesses.length;
    const averageTurnaroundTime =
      totalTurnaroundTime / completedProcesses.length;
    const throughput = completedProcesses.length / (currentTime / 1000); // processes per second
    const cpuUtilization =
      currentTime > 0 ? (totalBurstTime / currentTime) * 100 : 0;

    return new AlgorithmMetrics({
      totalProcesses: processes.length,
      averageWaitingTime,
      averageTurnaroundTime,
      throughput,
      cpuUtilization,
      totalExecutionTime: currentTime,
    });
  }

  // Immutable data access
  toData(): AlgorithmMetricsData {
    return { ...this._data };
  }

  clone(): AlgorithmMetrics {
    return new AlgorithmMetrics({ ...this._data });
  }
}
