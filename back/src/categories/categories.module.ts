import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuditInterceptor } from 'src/common/interceptors/audit.interceptor';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, PrismaService,AuditInterceptor],
})
export class CategoriesModule {}
