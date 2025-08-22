export class ProcessId {
  private readonly value: string;

  constructor(value: string) {
    if (!value || value.trim() === '') {
      throw new Error('ProcessId cannot be empty');
    }
    this.value = value;
  }

  toString(): string {
    return this.value;
  }

  equals(other: ProcessId): boolean {
    return this.value === other.value;
  }

  static generate(): ProcessId {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return new ProcessId(`P${timestamp}${random}`);
  }
}
