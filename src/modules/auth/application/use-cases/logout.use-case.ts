import { Inject, Injectable } from '@nestjs/common';
import type { IAuthRepository } from '../../domain/repositories/auth.repository.interface';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject('IAuthRepository')
    private readonly authRepository: IAuthRepository,
  ) {}

  async execute(userId: string): Promise<void> {
    await this.authRepository.deleteByUserId(userId);
  }
}
