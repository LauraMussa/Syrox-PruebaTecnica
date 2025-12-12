import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseBoolPipe,
  Put,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import {
  ReorderCategoriesDto,
  UpdateCategoryDto,
} from './dto/update-category.dto';
import { PaginationDto } from 'src/products/dto/pagination.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.categoriesService.findAll(paginationDto);
  }

  @Get('tree')
  findAllTree() {
    return this.categoriesService.findAllTree();
  }

  @Get('parent')
  findAllParent() {
    return this.categoriesService.findAllParent();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Put('reorder')
  reorder(@Body() reorderCategoryDto: ReorderCategoriesDto) {
    return this.categoriesService.reorder(reorderCategoryDto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Query('force', new DefaultValuePipe(false), ParseBoolPipe) force: boolean,
  ) {
    return this.categoriesService.remove(id, force);
  }
}
