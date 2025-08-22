export enum ProcessStatus {
  WAITING = 'waiting',
  RUNNING = 'running',
  COMPLETED = 'completed',
  READY = 'ready',
}

export interface ProcessData {
  id: number;
  name: string;
  arrivalTime: number;
  burstTime: number;
  size: number;
  startTime?: number;
  endTime?: number;
  waitingTime?: number;
  turnaroundTime?: number;
  status: ProcessStatus;
  remainingTime: number;
}

export class Process {
  private _data: ProcessData;

  constructor(data: ProcessData) {
    this.validateProcessData(data);
    this._data = { ...data };
  }

  private validateProcessData(data: ProcessData): void {
    if (data.burstTime <= 0) {
      throw new Error('Burst time must be greater than 0');
    }
    if (data.size <= 0) {
      throw new Error('Process size must be greater than 0');
    }
    if (data.arrivalTime < 0) {
      throw new Error('Arrival time cannot be negative');
    }
  }
  get id(): number {
    return this._data.id;
  }
  get name(): string {
    return this._data.name;
  }
  get arrivalTime(): number {
    return this._data.arrivalTime;
  }
  get burstTime(): number {
    return this._data.burstTime;
  }
  get size(): number {
    return this._data.size;
  }
  get startTime(): number | undefined {
    return this._data.startTime;
  }
  get endTime(): number | undefined {
    return this._data.endTime;
  }
  get waitingTime(): number | undefined {
    return this._data.waitingTime;
  }
  get turnaroundTime(): number | undefined {
    return this._data.turnaroundTime;
  }
  get status(): ProcessStatus {
    return this._data.status;
  }
  get remainingTime(): number {
    return this._data.remainingTime;
  }

  start(currentTime: number): void {
    if (
      this._data.status !== ProcessStatus.READY &&
      this._data.status !== ProcessStatus.WAITING
    ) {
      throw new Error('Process must be in READY or WAITING status to start');
    }
    this._data.status = ProcessStatus.RUNNING;
    this._data.startTime = currentTime;
  }

  execute(timeStep: number): void {
    if (this._data.status !== ProcessStatus.RUNNING) {
      throw new Error('Only running processes can be executed');
    }
    this._data.remainingTime = Math.max(0, this._data.remainingTime - timeStep);
  }

  complete(currentTime: number): void {
    if (this._data.status !== ProcessStatus.RUNNING) {
      throw new Error('Only running processes can be completed');
    }
    this._data.status = ProcessStatus.COMPLETED;
    this._data.endTime = currentTime;
    this._data.remainingTime = 0;
    this.calculateTimes();
  }

  setReady(): void {
    this._data.status = ProcessStatus.READY;
  }

  setWaiting(): void {
    this._data.status = ProcessStatus.WAITING;
  }

  private calculateTimes(): void {
    if (
      this._data.startTime !== undefined &&
      this._data.endTime !== undefined
    ) {
      // Turnaround time: tiempo total desde llegada hasta finalización
      this._data.turnaroundTime = this._data.endTime - this._data.arrivalTime;
      
      // Waiting time: turnaround time - burst time
      // Esto es correcto tanto para algoritmos preemptivos como no preemptivos
      this._data.waitingTime = this._data.turnaroundTime - this._data.burstTime;
    }
  }

  isCompleted(): boolean {
    return this._data.status === ProcessStatus.COMPLETED;
  }

  isRunning(): boolean {
    return this._data.status === ProcessStatus.RUNNING;
  }

  isReady(): boolean {
    return this._data.status === ProcessStatus.READY;
  }

  isWaiting(): boolean {
    return this._data.status === ProcessStatus.WAITING;
  }

  toData(): ProcessData {
    return { ...this._data };
  }

  clone(): Process {
    return new Process({ ...this._data });
  }
}
