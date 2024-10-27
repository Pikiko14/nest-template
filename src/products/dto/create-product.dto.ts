import {
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
  IsNumber,
  IsInt,
  IsArray,
  IsIn,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsOptional()
  @IsPositive()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  stock?: number;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsString({ each: true })
  @IsArray()
  sizes?: string[];

  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
