import { MetricsDTO } from '../../application/dto/MetricsDTO';
import { ProcessDTO } from '../../application/dto/ProcessDTO';
import { SimulationService } from '../../application/services/SimulationService';
import { Process } from '../../domain/entities/Process';

export class SimulationAdapter {
  constructor(private simulationService: SimulationService) {}

  startSimulation(): void {
    this.simulationService.startSimulation();
  }

  pauseSimulation(): void {
    this.simulationService.pauseSimulation();
  }

  resetSimulation(): void {
    this.simulationService.resetSimulation();
  }

  executeStep(timeStep: number): void {
    this.simulationService.executeStep(timeStep);
  }

  addProcess(process: Process): void {
    this.simulationService.addProcess(process);
  }

  getFCFSProcesses(): ProcessDTO[] {
    const scheduler = this.simulationService.getFCFSScheduler();
    return scheduler.getAllProcesses().map(this.toProcessDTO);
  }

  getSJFProcesses(): ProcessDTO[] {
    const scheduler = this.simulationService.getSJFScheduler();
    return scheduler.getAllProcesses().map(this.toProcessDTO);
  }

  getSRTFProcesses(): ProcessDTO[] {
    const scheduler = this.simulationService.getSRTFScheduler();
    return scheduler.getAllProcesses().map(this.toProcessDTO);
  }

  getSPProcesses(): ProcessDTO[] {
    return this.getSRTFProcesses();
  }

  getFCFSMetrics(): MetricsDTO {
    const scheduler = this.simulationService.getFCFSScheduler();
    const metrics = scheduler.getMetrics(0);
    return this.toMetricsDTO(metrics, 'FCFS');
  }

  getSJFMetrics(): MetricsDTO {
    const scheduler = this.simulationService.getSJFScheduler();
    const metrics = scheduler.getMetrics(0);
    return this.toMetricsDTO(metrics, 'SJF');
  }

  getSRTFMetrics(): MetricsDTO {
    const scheduler = this.simulationService.getSRTFScheduler();
    const metrics = scheduler.getMetrics(0);
    return this.toMetricsDTO(metrics, 'SRTF');
  }

  getSPMetrics(): MetricsDTO {
    return this.getSRTFMetrics();
  }

  private toProcessDTO(process: Process): ProcessDTO {
    return {
      id: process.id.toString(),
      name: process.name,
      arrivalTime: process.arrivalTime,
      burstTime: process.burstTime,
      size: process.size,
      status: process.status,
      remainingTime: process.remainingTime,
      startTime: process.startTime,
      endTime: process.endTime,
      waitingTime: process.waitingTime,
      turnaroundTime: process.turnaroundTime,
    };
  }

  private toMetricsDTO(metrics: any, algorithmName: string): MetricsDTO {
    return {
      algorithmName,
      averageWaitingTime: metrics.averageWaitingTime || 0,
      averageTurnaroundTime: metrics.averageTurnaroundTime || 0,
      throughput: metrics.throughput || 0,
      cpuUtilization: metrics.cpuUtilization || 0,
      totalProcesses: metrics.totalProcesses || 0,
      completedProcesses: metrics.completedProcesses || 0,
    };
  }
}
