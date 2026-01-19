import { AuthEntity } from '../entities/auth.entity';

export interface IAuthRepository {
  create(refreshToken: AuthEntity): Promise<void>;
  findByToken(token: string): Promise<AuthEntity | null>;
  findByUserId(userId: string): Promise<AuthEntity | null>;
  deleteByUserId(userId: string): Promise<void>;
}
