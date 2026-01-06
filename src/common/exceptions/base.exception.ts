import { HttpException, HttpStatus } from '@nestjs/common';

export interface ExceptionResponse {
  success: false;
  statusCode: number;
  errorCode: string;
  message: string;
  errors?: any[];
  timestamp: string;
  path?: string;
  correlationId?: string;
}

export class BaseException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus,
    errorCode: string,
    errors?: any[],
  ) {
    const response: Omit<
      ExceptionResponse,
      'timestamp' | 'path' | 'correlationId'
    > = {
      success: false,
      statusCode,
      errorCode,
      message,
      ...(errors && { errors }),
    };
    super(response, statusCode);
  }
}
