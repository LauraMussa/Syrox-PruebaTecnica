import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomerDto } from './dto/customer.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}
  async create(dto: CustomerDto) {
    return await this.prisma.customer.create({
      data: dto,
    });
  }

  async findAll() {
    return await this.prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { sales: true } } }, // esto devuelve cuántas compras hizo
    });
  }
}
