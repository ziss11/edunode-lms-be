import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { BaseErrorResponse } from '../responses/base-error.response';
import { BaseResponse } from '../responses/base.response';

export function ApiStandardResponse<T extends Type<any>>(
  dataDto?: T,
  options?: {
    status?: number;
    description?: string;
    isArray?: boolean;
  },
) {
  const decorators = [
    ApiExtraModels(BaseResponse, BaseErrorResponse),
    ...(dataDto ? [ApiExtraModels(dataDto)] : []),
  ];

  const responseSchema = dataDto
    ? {
        allOf: [
          { $ref: getSchemaPath(BaseResponse) },
          {
            properties: {
              data: options?.isArray
                ? {
                    type: 'array',
                    items: { $ref: getSchemaPath(dataDto) },
                  }
                : { $ref: getSchemaPath(dataDto) },
            },
          },
        ],
      }
    : { $ref: getSchemaPath(BaseResponse) };

  if (options?.status === 201) {
    decorators.push(
      ApiCreatedResponse({
        description: options.description || 'Resource created successfully',
        schema: responseSchema,
      }),
    );
  } else {
    decorators.push(
      ApiOkResponse({
        description: options?.description || 'Operation successful',
        schema: responseSchema,
      }),
    );
  }

  decorators.push(
    ApiBadRequestResponse({
      description: 'Bad Request',
      type: BaseErrorResponse,
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      type: BaseErrorResponse,
    }),
    ApiForbiddenResponse({
      description: 'Forbidden',
      type: BaseErrorResponse,
    }),
    ApiNotFoundResponse({
      description: 'Not Found',
      type: BaseErrorResponse,
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal Server Error',
      type: BaseErrorResponse,
    }),
  );

  return applyDecorators(...decorators);
}
