import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export class PaginationQueryDto {
  @IsNumber()
  page?: number;

  @IsNumber()
  limit?: number;

  @IsEnum(['id', 'createdAt'], {
    message: 'Order by must be id or createdAt',
  })
  @IsOptional()
  orderBy?: 'id' | 'createdAt';

  @IsEnum(['asc', 'desc'], {
    message: 'Order direction must be asc or desc',
  })
  @IsOptional()
  orderDirection?: 'asc' | 'desc';
}
