/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const { method, url, body, headers } = request;
    const correlationId = headers['x-correlation-id'] as string;
    const startTime = Date.now();

    this.logger.log(`Incoming Request: ${method} ${url}`, {
      correlationId,
      method,
      url,
      body: this.sanitizeBody(body),
      userAgent: headers['user-agent'],
    });

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          this.logger.log(
            `Outgoing Response: ${method} ${url} ${response.statusCode} - ${duration}ms`,
            {
              correlationId,
              method,
              url,
              statusCode: response.statusCode,
              duration,
            },
          );
        },
        error: (error: { message: string }) => {
          const duration = Date.now() - startTime;
          this.logger.log(`Request Failed: ${method} ${url} - ${duration}ms`, {
            correlationId,
            method,
            url,
            duration: `${duration}ms`,
            error: error.message,
          });
        },
      }),
    );
  }

  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') return body;

    const sensitiveFields = ['password', 'token', 'secret', 'apiKey'];
    const sanitized = { ...body };

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '******';
      }
    }

    return sanitized;
  }
}
