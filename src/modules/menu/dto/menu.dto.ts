import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateMenuDto {
  @IsNotEmpty({ message: 'Menu name should not be empty' })
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  parentId?: string;

  @IsNumber()
  @IsOptional()
  depth?: number;
}

export class UpdateMenuDto {
  @IsNotEmpty({ message: 'Menu name should not be empty' })
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name: string;
}
