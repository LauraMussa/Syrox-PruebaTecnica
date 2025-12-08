import {  IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsOptional() 
  position?: number;

  @IsString()
  @IsUUID()
  @IsOptional() 
  parentId?: string;
}