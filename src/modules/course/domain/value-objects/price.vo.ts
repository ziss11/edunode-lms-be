export class Price {
  private readonly amount: number;
  private readonly currency: string;

  constructor(amount: number, currency: string = 'IDR') {
    if (amount < 0) {
      throw new Error('Price cannot be negative');
    }
    this.amount = amount;
    this.currency = currency;
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }

  isFree(): boolean {
    return this.amount === 0;
  }

  format(): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: this.currency,
    }).format(this.amount);
  }
}
