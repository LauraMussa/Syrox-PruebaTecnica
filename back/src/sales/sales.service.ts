import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSaleDto, OrderStatus } from './dto/create-sale.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from 'src/products/dto/pagination.dto';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSaleDto) {
    return this.prisma.$transaction(async (tx) => {
      const customer = await tx.customer.findUnique({
        where: { id: dto.customerId },
      });

      if (!customer) {
        throw new NotFoundException('El cliente no existe');
      }

      let totalSale = 0;
      const itemsToCreate = [];

      for (const itemDto of dto.items) {
        const product = await tx.product.findUnique({
          where: { id: itemDto.productId },
        });

        if (!product) {
          throw new NotFoundException(
            `El producto con ID ${itemDto.productId} no existe`,
          );
        }

        if (product.stock < itemDto.quantity) {
          throw new BadRequestException(
            `Stock insuficiente para ${product.name}. Disponible: ${product.stock}`,
          );
        }

        await tx.product.update({
          where: { id: product.id },
          data: { stock: product.stock - itemDto.quantity },
        });

        const subtotal = Number(product.price) * itemDto.quantity;
        totalSale += subtotal;

        itemsToCreate.push({
          productId: product.id,
          quantity: itemDto.quantity,
          price: product.price,
        });
      }

      const generateOrderNumber = () => {
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const random = Math.floor(Math.random() * 10000)
          .toString()
          .padStart(4, '0');
        return `${date}-${random}`;
      };

      const sale = await tx.sale.create({
        data: {
          orderNumber: generateOrderNumber(),
          customerId: dto.customerId,
          total: totalSale,
          status: dto.status || 'PENDING',
          paymentStatus: dto.paymentStatus || 'PENDING',
          paymentMethod: dto.paymentMethod,
          items: {
            create: itemsToCreate,
          },
          note: dto.note,
        },
        include: {
          items: {
            include: { product: true },
          },
          customer: true,
        },
      });

      return sale;
    });
  }

  async findAll(paginationDto?: PaginationDto) {
    const { page, limit } = paginationDto || {};

    const includeOptions = {
      items: {
        select: {
          id: true,
          quantity: true,
          price: true,
          product: {
            select: {
              name: true,
              description: true,
              price: true,
              brand: true,
              category: true,
            },
          },
        },
      },
      customer: true,
    };

    if (page && limit) {
      const skip = (page - 1) * limit;
      const totalSales = await this.prisma.sale.count();

      const data = await this.prisma.sale.findMany({
        skip,
        take: limit,
        include: includeOptions,
        orderBy: { createdAt: 'desc' },
      });

      return {
        data,
        meta: {
          totalSales,
          page,
          lastPage: Math.ceil(totalSales / limit),
        },
      };
    }

    return await this.prisma.sale.findMany({
      include: includeOptions,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async findOne(saleId: string) {
    return await this.prisma.sale.findUnique({
      where: { id: saleId },
      include: {
        items: {
          select: {
            id: true,
            quantity: true,

            price: true,
            product: {
              select: {
                name: true,
                description: true,
                price: true,
                images: true,
              },
            },
          },
        },
        customer: true,
      },
    });
  }

  async update(
    saleId: string,
    status: OrderStatus,
    trackingId?: string,
    note?: string,
  ) {
    return (
      this,
      this.prisma.sale.update({
        where: { id: saleId },
        data: {
          status: status,
          trackingId: trackingId,
          note: note,
        },
        include: { customer: true, items: true },
      })
    );
  }
}
