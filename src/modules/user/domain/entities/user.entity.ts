import { UserRole } from '../enums/user-role.enum';
import { Email } from '../value-objects/email.vo';
import { Password } from '../value-objects/password.vo';

export class UserEntity {
  constructor(
    public readonly id: string,
    public email: Email,
    public password: Password,
    public firstName: string,
    public lastName: string,
    public role: UserRole,
    public isActive: boolean,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  update(
    email?: Email,
    firstName?: string,
    lastName?: string,
    role?: UserRole,
  ): void {
    this.email = email || this.email;
    this.firstName = firstName || this.firstName;
    this.lastName = lastName || this.lastName;
    this.role = role || this.role;
    this.updatedAt = new Date();
  }

  changePassword(password: Password): void {
    this.password = password;
  }

  async validatePassword(password: string): Promise<boolean> {
    return await this.password.compare(password);
  }
}
