export class AuthenticationEntity {
  constructor(
    public id: string,
    public userId: string,
    public token: string,
    public expiresAt: Date,
    public createdAt: Date,
  ) {}

  isExpired(): boolean {
    return this.expiresAt < new Date();
  }
}
