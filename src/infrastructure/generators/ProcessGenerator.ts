import { Process, ProcessStatus } from '../../domain/entities/Process';
import { SimulationConfig } from '../../domain/value-objects/SimulationConfig';

export class ProcessGenerator {
  private static processIdCounter = 1;

  static generateRandomProcess(
    config: SimulationConfig,
    currentTime: number,
  ): Process {
    const burstTime = Math.floor(
      Math.random() * (config.maxBurstTime - config.minBurstTime + 1) +
        config.minBurstTime,
    );

    const size = Math.floor(
      Math.random() * (config.maxProcessSize - config.minProcessSize + 1) +
        config.minProcessSize,
    );

    const processData = {
      id: this.processIdCounter++,
      name: `P${this.processIdCounter - 1}`,
      arrivalTime: currentTime,
      burstTime,
      size,
      status: ProcessStatus.WAITING,
      remainingTime: burstTime,
    };

    return new Process(processData);
  }

  static resetIdCounter(): void {
    this.processIdCounter = 1;
  }
}
