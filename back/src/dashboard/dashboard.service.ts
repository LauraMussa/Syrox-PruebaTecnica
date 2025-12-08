
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getInventoryStats() {
    const count = await this.prisma.product.count();

    const result = await this.prisma.$queryRaw<[{ totalValue: number }]>`
      SELECT SUM(price * stock) as "totalValue" FROM "products" WHERE "isActive" = true
    `;

    const totalValue = result[0]?.totalValue ? Number(result[0].totalValue) : 0;

    return {
      totalProducts: count,
      inventoryValue: totalValue,
    };
  }
}
