import { UserRole } from '../enums/user-role.enum';
import { Email } from '../value-objects/email.vo';
import { Password } from '../value-objects/password.vo';

export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly email: Email,
    public readonly password: Password,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly role: UserRole,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  get isInstructor(): boolean {
    return this.role === UserRole.INSTRUCTOR;
  }

  get isStudent(): boolean {
    return this.role === UserRole.STUDENT;
  }

  get isVerified(): boolean {
    return this.isActive;
  }

  activate(): UserEntity {
    return new UserEntity(
      this.id,
      this.email,
      this.password,
      this.firstName,
      this.lastName,
      this.role,
      true,
      this.createdAt,
      new Date(),
    );
  }

  deactivate(): UserEntity {
    return new UserEntity(
      this.id,
      this.email,
      this.password,
      this.firstName,
      this.lastName,
      this.role,
      false,
      this.createdAt,
      new Date(),
    );
  }
}
