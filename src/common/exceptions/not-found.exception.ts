import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class NotFoundException extends BaseException {
  constructor(message: string = 'Resource not found', errors?: any[]) {
    super(message, HttpStatus.NOT_FOUND, 'NOT_FOUND', errors);
  }
}
