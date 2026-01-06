import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class BadRequestException extends BaseException {
  constructor(message: string = 'Bad request', errors?: any[]) {
    super(message, HttpStatus.BAD_REQUEST, 'BAD_REQUEST', errors);
  }
}
