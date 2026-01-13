import { AuthenticationEntity } from '../entities/authentication.entity';

export interface IAuthenticationRepository {
  create(refreshToken: AuthenticationEntity): Promise<void>;
  findByToken(token: string): Promise<AuthenticationEntity | null>;
  findByUserId(userId: string): Promise<AuthenticationEntity | null>;
  deleteByUserId(userId: string): Promise<void>;
}
