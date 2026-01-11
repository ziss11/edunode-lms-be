import { UserEntity } from '../entities/user.entity';
import { UserRole } from '../enums/user-role.enum';

export interface FindAllOptions {
  page?: number;
  limit?: number;
  orderBy?: 'id' | 'createdAt';
  orderDirection?: 'asc' | 'desc';
  filters?: {
    search?: string;
    role?: UserRole;
    isActive?: boolean;
  };
}

export interface IUserRepository {
  create(user: UserEntity): Promise<UserEntity>;
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findAll(
    options: FindAllOptions,
  ): Promise<{ users: UserEntity[]; total: number }>;
  update(id: string, user: UserEntity): Promise<UserEntity | null>;
  updatePassword(id: string, password: string): Promise<boolean>;
  delete(id: string): Promise<void>;
}
