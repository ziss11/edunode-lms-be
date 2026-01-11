import { ApiProperty } from '@nestjs/swagger';

export class BaseErrorDetailResponse {
  @ApiProperty({ example: 'required' })
  code?: string;

  @ApiProperty({ example: 'email' })
  field?: string;

  @ApiProperty({ example: 'Email is required' })
  message?: string;
}

export class BaseErrorResponse {
  @ApiProperty({ example: 'message' })
  message: string;

  @ApiProperty({ type: [BaseErrorDetailResponse], required: false })
  errors?: BaseErrorDetailResponse[];

  constructor(partial: Partial<BaseErrorResponse>) {
    Object.assign(this, partial);
  }
}
