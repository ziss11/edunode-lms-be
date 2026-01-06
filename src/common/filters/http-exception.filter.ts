import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseErrorResponse } from '../responses/base-error.response';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorResponse: BaseErrorResponse;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as {
          success: boolean;
          statusCode: number;
          errorCode: string;
          message: string;
          errors?: any[];
        };

        errorResponse = new BaseErrorResponse({
          success: false,
          statusCode: status,
          errorCode: responseObj.errorCode || 'INTERNAL_SERVER_ERROR',
          message: responseObj.message || exception.message,
          errors: responseObj.errors,
          correlationId: request.headers['x-correlation-id'] as string,
        });
      } else {
        errorResponse = new BaseErrorResponse({
          success: false,
          statusCode: status,
          errorCode: 'INTERNAL_SERVER_ERROR',
          message: exception.message,
          correlationId: request.headers['x-correlation-id'] as string,
        });
      }
    } else {
      const error = exception as Error;
      errorResponse = new BaseErrorResponse({
        success: false,
        statusCode: status,
        errorCode: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
        correlationId: request.headers['x-correlation-id'] as string,
      });

      this.logger.error(`Unhandled exception: ${error.message}`, error.stack, {
        correlationId: request.headers['x-correlation-id'] as string,
        path: request.url,
        method: request.method,
      });
    }

    response.status(status).json(errorResponse);
  }
}
