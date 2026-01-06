import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class ConflictException extends BaseException {
  constructor(message: string = 'Resource already exists', errors?: any[]) {
    super(message, HttpStatus.CONFLICT, 'CONFLICT', errors);
  }
}
