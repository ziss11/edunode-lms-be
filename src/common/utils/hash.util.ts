import * as bcrypt from 'bcrypt';

export class HashUtil {
  private static readonly SALT_ROUNDS = 10;

  static async hash(plainText: string): Promise<string> {
    const result = await bcrypt.hash(plainText, this.SALT_ROUNDS);
    return result;
  }

  static async compare(plainText: string, hash: string): Promise<boolean> {
    const result = await bcrypt.compare(plainText, hash);
    return result;
  }
}
