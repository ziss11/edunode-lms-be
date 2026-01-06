import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ZodError, ZodType } from 'zod';
import { ValidationException } from '../exceptions/validation.exception';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(_: ArgumentMetadata, value: any) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err) => ({
          field: err.path.join('.') || 'root',
          message: err.message,
          code: err.code,
        }));

        throw new ValidationException('Validation failed', errors);
      }
      throw error;
    }
  }
}
