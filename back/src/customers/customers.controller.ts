import { Body, Controller, Get, Post } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomerDto } from './dto/customer.dto';

@Controller('customers')
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
