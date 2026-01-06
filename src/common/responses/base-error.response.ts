import { ApiProperty } from '@nestjs/swagger';

export class BaseErrorDetailResponse {
  @ApiProperty({ example: 'REQUIRED' })
  code?: string;

  @ApiProperty({ example: 'email' })
  field?: string;

  @ApiProperty({ example: 'Email is required' })
  message?: string;
}

export class BaseErrorResponse {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ example: '400' })
  statusCode: number;

  @ApiProperty({ example: 'ERR_VALIDATION' })
  errorCode: string;

  @ApiProperty({ example: 'Validation failed' })
  message: string;

  @ApiProperty({ type: [BaseErrorDetailResponse], required: false })
  errors?: BaseErrorDetailResponse[];

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  timestamp?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3' })
  correlationId?: string;

  constructor(partial: Partial<BaseErrorResponse>) {
    Object.assign(this, partial);
    this.success = false;
    this.timestamp = new Date().toISOString();
  }
}
