export class ArrivalTime {
  private readonly value: number;

  constructor(value: number) {
    if (value < 0) {
      throw new Error('Arrival time cannot be negative');
    }
    this.value = value;
  }

  getValue(): number {
    return this.value;
  }

  isBefore(other: ArrivalTime): boolean {
    return this.value < other.value;
  }

  isAfter(other: ArrivalTime): boolean {
    return this.value > other.value;
  }

  equals(other: ArrivalTime): boolean {
    return this.value === other.value;
  }
}
