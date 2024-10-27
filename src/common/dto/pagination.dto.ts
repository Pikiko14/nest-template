import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  offset?: number;
}
