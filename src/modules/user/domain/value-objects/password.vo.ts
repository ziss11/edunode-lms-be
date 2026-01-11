import { HashUtil } from '../../../../common/utils/hash.util';

export class Password {
  private readonly hashedValue: string;

  constructor(hashedValue: string) {
    this.hashedValue = hashedValue;
  }

  static async create(plainPassword: string): Promise<Password> {
    if (plainPassword.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    const hasLowercase = plainPassword.toLowerCase() !== plainPassword;
    if (!hasLowercase) {
      throw new Error('Password must contain at least one lowercase letter');
    }

    const hasUppercase = plainPassword.toUpperCase() !== plainPassword;
    if (!hasUppercase) {
      throw new Error('Password must contain at least one uppercase letter');
    }

    const hasNumber = /\d/.test(plainPassword);
    if (!hasNumber) {
      throw new Error('Password must contain at least one number');
    }

    const hasSpecialChar = /[^a-zA-Z0-9]/.test(plainPassword);
    if (!hasSpecialChar) {
      throw new Error('Password must contain at least one special character');
    }

    const hashed = await HashUtil.hash(plainPassword);
    return new Password(hashed);
  }

  static fromHash(hashedPassword: string): Password {
    return new Password(hashedPassword);
  }

  async compare(plainPassword: string): Promise<boolean> {
    return await HashUtil.compare(plainPassword, this.hashedValue);
  }

  getValue(): string {
    return this.hashedValue;
  }
}
