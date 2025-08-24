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

  static generateFromData(data: {
    id: number;
    name: string;
    arrivalTime: number;
    burstTime: number;
    size: number;
    status: string;
    remainingTime: number;
  }): Process {
    return new Process({
      ...data,
      status: ProcessStatus.WAITING,
    });
  }

  static getNextId(): number {
    return this.processIdCounter;
  }

  static incrementCounter(amount: number = 1): void {
    this.processIdCounter += amount;
  }

  static resetIdCounter(): void {
    this.processIdCounter = 1;
  }
}
