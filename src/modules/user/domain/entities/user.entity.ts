import { HashUtil } from '../../../../common/utils/hash.util';
import { UserRole } from '../enums/user-role.enum';

export class UserEntity {
  constructor(
    public readonly id: string,
    public email: string,
    public password: string,
    public fullName: string,
    public role: UserRole,
    public isActive: boolean,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  update(email?: string, fullName?: string, role?: UserRole): void {
    this.email = email || this.email;
    this.fullName = fullName || this.fullName;
    this.role = role || this.role;
    this.updatedAt = new Date();
  }

  async changePassword(password: string): Promise<void> {
    this.password = await HashUtil.hash(password);
  }

  async validatePassword(password: string): Promise<boolean> {
    return await HashUtil.compare(this.password, password);
  }
}
