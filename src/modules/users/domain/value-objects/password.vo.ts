export class Password {
  private readonly value: string;

  constructor(password: string) {
    if (!this.isValid(password)) {
      throw new Error('Invalid password format');
    }
    this.value = password;
  }

  private isValid(password: string): boolean {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[a-zA-Z]).{8,}$/;
    const isValidPassword = passwordRegex.test(password);
    return isValidPassword;
  }

  getValue(): string {
    return this.value;
  }
}
