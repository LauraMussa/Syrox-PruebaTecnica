import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  IsArray,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  @IsOptional() 
  stock?: number;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsBoolean()
  @IsOptional() 
  isActive?: boolean;

  @IsObject() 
  @IsOptional()
  options?: Record<string, any>;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  categoryId: string; 

  @IsArray()
  @IsString({ each: true }) 
  @IsOptional()
  images?: string[];
}
