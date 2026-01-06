import { ApiProperty } from '@nestjs/swagger';

export class MetaResponse {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 100 })
  totalData: number;

  @ApiProperty({ example: 10 })
  totalPages: number;

  constructor(partial: Partial<MetaResponse>) {
    Object.assign(this, partial);
    this.totalPages = Math.ceil(this.totalData / this.limit);
  }
}
