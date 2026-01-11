import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { BaseErrorResponse } from '../responses/base-error.response';
import {
  BaseListResponse,
  BaseObjectResponse,
} from '../responses/base.response';
import { MetaResponse } from '../responses/meta.response';

export interface ApiStandardResponseOptions {
  status?: number;
  description?: string;
  isArray?: boolean;
}

export function ApiStandardResponse<T extends Type<any>>(
  dataDto?: T,
  options?: ApiStandardResponseOptions,
) {
  const isArray = options?.isArray ?? false;

  const decorators = [
    ApiExtraModels(
      BaseObjectResponse,
      BaseListResponse,
      MetaResponse,
      BaseErrorResponse,
    ),
    ...(dataDto ? [ApiExtraModels(dataDto)] : []),
  ];

  const responseSchema = buildResponseSchema(dataDto, isArray);

  addSuccessResponseDecorator(decorators, responseSchema, options);
  addErrorResponseDecorators(decorators);

  return applyDecorators(...decorators);
}

function buildResponseSchema<T extends Type<any>>(
  dataDto: T | undefined,
  isArray: boolean,
): object {
  if (!dataDto) {
    return { $ref: getSchemaPath(BaseObjectResponse) };
  }

  if (isArray) {
    return {
      allOf: [
        { $ref: getSchemaPath(BaseListResponse) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(dataDto) },
            },
            meta: {
              $ref: getSchemaPath(MetaResponse),
            },
          },
        },
      ],
    };
  }

  return {
    allOf: [
      { $ref: getSchemaPath(BaseObjectResponse) },
      {
        properties: {
          data: { $ref: getSchemaPath(dataDto) },
        },
      },
    ],
  };
}

function addSuccessResponseDecorator(
  decorators: (ClassDecorator | MethodDecorator | PropertyDecorator)[],
  responseSchema: object,
  options?: ApiStandardResponseOptions,
): void {
  const status = options?.status;
  const description = options?.description;

  switch (status) {
    case HttpStatus.CREATED:
      decorators.push(
        ApiCreatedResponse({
          description: description || 'Resource created successfully',
          schema: responseSchema,
        }),
      );
      break;
    case HttpStatus.NO_CONTENT:
      decorators.push(
        ApiNoContentResponse({
          description: description || 'Operation successful',
        }),
      );
      break;
    default:
      decorators.push(
        ApiOkResponse({
          description: description || 'Operation successful',
          schema: responseSchema,
        }),
      );
      break;
  }
}

function addErrorResponseDecorators(
  decorators: (ClassDecorator | MethodDecorator | PropertyDecorator)[],
): void {
  decorators.push(
    ApiBadRequestResponse({
      description: 'Bad Request - Validation failed or invalid input',
      schema: {
        allOf: [{ $ref: getSchemaPath(BaseErrorResponse) }],
        example: {
          message: 'Validation failed',
          errors: [
            {
              code: 'required',
              field: 'email',
              message: 'Email is required',
            },
            {
              code: 'invalidFormat',
              field: 'password',
              message: 'Password must be at least 8 characters',
            },
          ],
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized - Authentication required',
      schema: {
        allOf: [{ $ref: getSchemaPath(BaseErrorResponse) }],
        example: {
          message: 'Unauthorized access',
          errors: [
            {
              code: 'unauthorized',
              message: 'Invalid or expired token',
            },
          ],
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'Forbidden - Insufficient permissions',
      schema: {
        allOf: [{ $ref: getSchemaPath(BaseErrorResponse) }],
        example: {
          message: 'Access denied',
          errors: [
            {
              code: 'forbidden',
              message: 'You do not have permission to access this resource',
            },
          ],
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Not Found - Resource does not exist',
      schema: {
        allOf: [{ $ref: getSchemaPath(BaseErrorResponse) }],
        example: {
          message: 'Resource not found',
          errors: [
            {
              code: 'notFound',
              message: 'User with the specified ID was not found',
            },
          ],
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal Server Error - Unexpected server error',
      schema: {
        allOf: [{ $ref: getSchemaPath(BaseErrorResponse) }],
        example: {
          message: 'Internal server error',
          errors: [
            {
              code: 'internalError',
              message: 'An unexpected error occurred. Please try again later.',
            },
          ],
        },
      },
    }),
  );
}
