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
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const products = await this.prisma.product.findMany({
      skip: skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const totalProducts = await this.prisma.product.count();

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
    return await this.findProduct(productId);
  }

  async update(productId: string, dto: UpdateProductDto) {
    await this.findProduct(productId);
    return await this.prisma.product.update({
      where: { id: productId },
      data: dto,
    });
  }

  async remove(productId: string) {
    await this.findProduct(productId);
    return this.prisma.product.update({
      where: { id: productId },
      data: { isActive: false },
    });
  }

  async findTopSelling() {
    // 1. Agrupar por productId en la tabla SaleItem y sumar cantidades
    const topSales = await this.prisma.saleItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc', // Los que más cantidad vendieron primero
        },
      },
      take: 5, // Top 5
    });

    // 2. Obtener los detalles de esos productos (Nombre, Precio, Foto)
    // Porque el groupBy solo te devuelve { productId: "...", _sum: { quantity: 10 } }

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

    // 3. (Opcional) Combinar para devolver producto + cantidad vendida
    return topSales.map((salesStat) => {
      const productInfo = products.find((p) => p.id === salesStat.productId);
      return {
        ...productInfo,
        totalSold: salesStat._sum.quantity,
      };
    });
  }
}
