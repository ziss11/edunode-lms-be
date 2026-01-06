import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

export const PaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

export type PaginationDto = z.infer<typeof PaginationSchema>;

export class PaginationQueryDto {
  @ApiProperty({ example: 1 })
  page?: number;

  @ApiProperty({ example: 10 })
  limit?: number;

  @ApiProperty({ example: 'createdAt' })
  sortBy?: string;

  @ApiProperty({ example: 'desc', enum: ['asc', 'desc'] })
  sortOrder?: 'asc' | 'desc';
}
