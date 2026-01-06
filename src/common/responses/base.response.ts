import { ApiProperty } from '@nestjs/swagger';
import { MetaResponse } from './meta.response';

export class BaseResponse<T = any> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: '200' })
  statusCode: number;

  @ApiProperty({ example: 'Operation Successful' })
  message: string;

  @ApiProperty()
  data?: T;

  @ApiProperty()
  meta?: MetaResponse;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  timestamp?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3' })
  correlationId?: string;

  constructor(partial: Partial<BaseResponse<T>>) {
    Object.assign(this, partial);
    if (this.success === undefined) {
      this.success = true;
    }
    if (!this.timestamp) {
      this.timestamp = new Date().toISOString();
    }
  }
}
