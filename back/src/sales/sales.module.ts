import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuditInterceptor } from 'src/common/interceptors/audit.interceptor';

@Module({
  controllers: [SalesController],
  providers: [SalesService, PrismaService,AuditInterceptor],
})
export class SalesModule {}
