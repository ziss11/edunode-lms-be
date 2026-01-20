import { AuthEntity } from '../entities/auth.entity';

export interface IAuthRepository {
  create(refreshToken: AuthEntity): Promise<void>;
  findByToken(token: string): Promise<AuthEntity | null>;
  findByUserId(userId: string): Promise<AuthEntity | null>;
  findById(id: string): Promise<AuthEntity | null>;
  delete(id: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
}
