import { HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { BaseErrorDetailResponse } from '../responses/base-error.response';
import { BaseException } from './base.exception';

export class ValidationException extends BaseException {
  constructor(errors?: ValidationError[] | BaseErrorDetailResponse[]) {
    const formattedErrors = ValidationException.formatErrors(errors);
    super(
      'Validation failed',
      HttpStatus.BAD_REQUEST,
      'VALIDATION_ERROR',
      formattedErrors,
    );
  }

  private static formatErrors(
    errors?: ValidationError[] | BaseErrorDetailResponse[],
  ): BaseErrorDetailResponse[] {
    if (!errors || errors.length === 0) {
      return [];
    }

    if (ValidationException.isBaseErrorDetailResponse(errors[0])) {
      return errors as BaseErrorDetailResponse[];
    }

    return ValidationException.formatValidationErrors(
      errors as ValidationError[],
    );
  }

  private static isBaseErrorDetailResponse(
    error: ValidationError | BaseErrorDetailResponse,
  ): error is BaseErrorDetailResponse {
    return (
      'code' in error ||
      'field' in error ||
      ('message' in error && !('property' in error))
    );
  }

  private static formatValidationErrors(
    validationErrors: ValidationError[],
    parentProperty = '',
  ): BaseErrorDetailResponse[] {
    const errors: BaseErrorDetailResponse[] = [];

    for (const error of validationErrors) {
      const property = parentProperty
        ? `${parentProperty}.${error.property}`
        : error.property;

      if (error.children && error.children.length > 0) {
        errors.push(...this.formatValidationErrors(error.children, property));
      }

      if (error.constraints) {
        for (const [code, message] of Object.entries(error.constraints)) {
          errors.push({
            code,
            field: property,
            message,
          });
        }
      }
    }

    return errors;
  }
}
