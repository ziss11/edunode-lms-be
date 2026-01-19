export class AuthEntity {
  constructor(
    public id: string,
    public userId: string,
    public token: string,
    public expiresAt: Date,
    public createdAt: Date,
  ) {}

  isTokenExpired(): boolean {
    return this.expiresAt < new Date();
  }
}
