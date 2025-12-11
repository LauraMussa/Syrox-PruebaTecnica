import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  private async findProduct(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new BadRequestException('No se encontró el producto');
    }
    return product;
  }

  async create(dto: CreateProductDto) {
    const categoryExits = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });
    if (!categoryExits) {
      throw new BadRequestException('La categoría no existe');
    }

    const productExists = await this.prisma.product.findFirst({
      where: {
        name: dto.name,
        categoryId: dto.categoryId,
        brand: dto.brand || null,
        gender: dto.gender || null,
        description: dto.description,
      },
    });

    if (productExists) {
      throw new BadRequestException(
        `Ya existe un producto '${dto.name}' con la misma marca y descripción en la categoria ${categoryExits.name}.`,
      );
    }

    return this.prisma.product.create({
      data: dto,
      include: { category: true },
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;
    const whereCondition = { isDeleted: false };
    const products = await this.prisma.product.findMany({
      skip: skip,
      take: limit,
      where: whereCondition,
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    });

    const totalProducts = await this.prisma.product.count({
      where: whereCondition,
    });

    return {
      data: products,
      meta: {
        totalProducts,
        page,
        lastPage: Math.ceil(totalProducts / limit),
      },
    };
  }

  async findOne(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new BadRequestException('No se encontró el producto');
    }
    return await this.prisma.product.findUnique({
      where: { id: productId },
      include: { category: true },
    });
  }

  async update(productId: string, dto: UpdateProductDto) {
    await this.findProduct(productId);
    return await this.prisma.product.update({
      where: { id: productId },
      data: dto,
      include: { category: true },
    });
  }

  async remove(id: string) {
    return await this.prisma.product.update({
      where: { id },
      data: {
        isDeleted: true,
        isActive: false,
      },
    });
  }

  async toggleActive(id: string) {
    const product = await this.findProduct(id);
    return await this.prisma.product.update({
      where: { id },
      data: { isActive: !product.isActive },
    });
  }

  async findTopSelling() {
    const topSales = await this.prisma.saleItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 5,
    });

    const productIds = topSales.map((item) => item.productId);

    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        name: true,
        price: true,
        images: true,
      },
    });

    return topSales.map((salesStat) => {
      const productInfo = products.find((p) => p.id === salesStat.productId);
      return {
        ...productInfo,
        totalSold: salesStat._sum.quantity,
      };
    });
  }
}
