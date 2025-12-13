import { Controller, Get } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('history')
export class HistoryController {
  constructor(private prisma: PrismaService) {}

  @Get()
  getHistory() {
    return this.prisma.auditLog.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}
