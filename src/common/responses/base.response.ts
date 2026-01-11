import { ApiProperty } from '@nestjs/swagger';
import { MetaResponse } from './meta.response';

export class BaseListResponse<T> {
  @ApiProperty()
  data: T[];

  @ApiProperty()
  meta: MetaResponse;

  constructor(data: T[], meta: MetaResponse) {
    this.data = data;
    this.meta = meta;
  }
}

export class BaseObjectResponse<T> {
  @ApiProperty()
  data: T;

  constructor(data: T) {
    this.data = data;
  }
}
