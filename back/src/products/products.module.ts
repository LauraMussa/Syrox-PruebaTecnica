import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuditInterceptor } from 'src/common/interceptors/audit.interceptor';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService,AuditInterceptor],
})
export class ProductsModule {}
