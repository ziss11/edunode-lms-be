export class Duration {
  private readonly durationInMinutes: number;

  constructor(durationInMinutes: number) {
    if (durationInMinutes <= 0) {
      throw new Error('Duration must be greater than 0');
    }
    this.durationInMinutes = durationInMinutes;
  }

  getMinutes(): number {
    return this.durationInMinutes;
  }

  getHours(): number {
    return this.durationInMinutes / 60;
  }

  format(): string {
    const hours = Math.floor(this.durationInMinutes / 60);
    const minutes = this.durationInMinutes % 60;
    return `${hours}h ${minutes}m`;
  }
}
