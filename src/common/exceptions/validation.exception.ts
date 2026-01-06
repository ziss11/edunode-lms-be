import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class ValidationException extends BaseException {
  constructor(message: string = 'Validation failed', errors?: any[]) {
    super(message, HttpStatus.BAD_REQUEST, 'VALIDATION_ERROR', errors);
  }
}
