import { AuthenticationEntity } from '../entities/authentication.entity';

export interface IAuthenticationRepository {
  create(refreshToken: AuthenticationEntity): Promise<void>;
  findByToken(token: string): Promise<AuthenticationEntity | null>;
  findByUserId(userId: string): Promise<AuthenticationEntity | null>;
  deleteByToken(token: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
}
