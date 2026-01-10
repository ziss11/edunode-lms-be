import { UserEntity } from '../entities/user.entity';

export interface IUserRepository {
  create(user: UserEntity): Promise<UserEntity>;
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findAll(
    page: number,
    limit: number,
  ): Promise<{ users: UserEntity[]; total: number }>;
  exists(email: string): Promise<boolean>;
  update(id: string, user: UserEntity): Promise<UserEntity | null>;
  updatePassword(id: string, password: string): Promise<boolean>;
  delete(id: string): Promise<void>;
}
