import { Inject, Injectable } from '@nestjs/common';
import type { IAuthenticationRepository } from '../../domain/repositories/authentication.repository.interface';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject('IAuthenticationRepository')
    private readonly authenticationRepository: IAuthenticationRepository,
  ) {}

  async execute(userId: string): Promise<void> {
    await this.authenticationRepository.deleteByUserId(userId);
  }
}
