import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomerDto } from './dto/customer.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuditInterceptor } from 'src/common/interceptors/audit.interceptor';
import { Audit } from 'src/common/decorators/audit.decorator';

@Controller('customers')
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditInterceptor)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}
  @Post()
  @Audit('CREAR_CLIENTE')
  create(@Body() custumerDto: CustomerDto) {
    return this.customersService.create(custumerDto);
  }

  @Get()
  findAll() {
    return this.customersService.findAll();
  }
}
