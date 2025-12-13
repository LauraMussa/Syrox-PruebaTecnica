import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from './dto/pagination.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuditInterceptor } from 'src/common/interceptors/audit.interceptor';
import { Audit } from 'src/common/decorators/audit.decorator';

@Controller('products')
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditInterceptor)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Audit('CREAR_PRODUCTO')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Get('top-selling')
  findTopSelling() {
    return this.productsService.findTopSelling();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @Audit('ACTUALIZAR_PRODUCTO')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Audit('ELIMINAR_PRODUCTO')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Patch('update-status/:id')
  @Audit('DESACTIVAR_PRODUCTO')
  toggleActive(@Param('id') id: string) {
    return this.productsService.toggleActive(id);
  }
}
