import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomerDto } from './dto/customer.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}
  @Post()
  create(@Body() custumerDto: CustomerDto) {
    return this.customersService.create(custumerDto);
  }

  @Get()
  findAll() {
    return this.customersService.findAll();
  }
}
