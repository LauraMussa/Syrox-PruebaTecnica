import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuditInterceptor } from 'src/common/interceptors/audit.interceptor';

@Module({
  controllers: [CustomersController],
  providers: [CustomersService, PrismaService,AuditInterceptor],
})
export class CustomersModule {}
