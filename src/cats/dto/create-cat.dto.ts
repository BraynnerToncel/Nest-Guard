import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateCatDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  name: string;
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  age: number;
  @IsString()
  @IsOptional()
  breed?: string;
}
