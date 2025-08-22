export class BurstTime {
  private readonly value: number;

  constructor(value: number) {
    if (value <= 0) {
      throw new Error('Burst time must be greater than 0');
    }
    this.value = value;
  }

  getValue(): number {
    return this.value;
  }

  isGreaterThan(other: BurstTime): boolean {
    return this.value > other.value;
  }

  isLessThan(other: BurstTime): boolean {
    return this.value < other.value;
  }

  equals(other: BurstTime): boolean {
    return this.value === other.value;
  }
}
