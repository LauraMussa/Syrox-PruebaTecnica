import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

export class ReorderCategoriesDto {
  @IsNotEmpty()
  parentId: string | null;

  @IsNotEmpty()
  categoryIds: string[];
}
