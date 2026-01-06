import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseResponse } from '../responses/base.response';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  BaseResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<BaseResponse<T>> {
    const request = context.switchToHttp().getRequest<Request>();
    const correlationId = request.headers['correlation-id'] as string;

    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object' && 'success' in data) {
          return new BaseResponse<T>({
            ...data,
            correlationId,
          } as unknown as Partial<BaseResponse<T>>);
        }

        return new BaseResponse<T>({
          success: true,
          statusCode: context.switchToHttp().getResponse<Response>().statusCode,
          message: 'Operation successful',
          data,
          correlationId,
        });
      }),
    );
  }
}
