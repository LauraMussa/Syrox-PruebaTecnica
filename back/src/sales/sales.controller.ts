import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleStatusDto } from './dto/update-sale.dto';
import { PaginationDto } from 'src/products/dto/pagination.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuditInterceptor } from 'src/common/interceptors/audit.interceptor';
import { Audit } from 'src/common/decorators/audit.decorator';

@Controller('sales')
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditInterceptor)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @Audit('CREAR_PEDIDO')
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @Get()
  findAll(@Query() paginationDto?: PaginationDto) {
    return this.salesService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }

  @Patch(':id')
  @Audit('ACTUALIZAR_ESTADO_PEDIDO')
  update(@Param('id') id: string, @Body() dto: UpdateSaleStatusDto) {
    return this.salesService.update(id, dto.status, dto.trackingId);
  }
}
