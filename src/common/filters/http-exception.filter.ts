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
          message: string;
          errors?: any[];
        };

        errorResponse = new BaseErrorResponse({
          message: responseObj.message,
          errors: responseObj.errors,
        });
      } else {
        errorResponse = new BaseErrorResponse({
          message: exception.message,
        });
      }
    } else {
      const error = exception as Error;
      errorResponse = new BaseErrorResponse({
        message: 'Internal server error',
      });

      this.logger.error(`Unhandled exception: ${error.message}`, error.stack, {
        path: request.url,
        method: request.method,
      });
    }

    response.status(status).json(errorResponse);
  }
}
