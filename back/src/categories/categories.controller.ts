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
  UseInterceptors,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import {
  ReorderCategoriesDto,
  UpdateCategoryDto,
} from './dto/update-category.dto';
import { PaginationDto } from 'src/products/dto/pagination.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuditInterceptor } from 'src/common/interceptors/audit.interceptor';
import { Audit } from 'src/common/decorators/audit.decorator';

@Controller('categories')
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditInterceptor)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Audit('CREAR_CATEGORIA')
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
  @Audit('ACTUALIZAR_CATEGORIA')
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
  @Audit('ELIMINAR_CATEGORIA')
  remove(
    @Param('id') id: string,
    @Query('force', new DefaultValuePipe(false), ParseBoolPipe) force: boolean,
  ) {
    return this.categoriesService.remove(id, force);
  }
}
