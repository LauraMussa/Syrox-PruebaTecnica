import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { SalesModule } from './sales/sales.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { CustomersModule } from './customers/customers.module';
import { DashboardService } from './dashboard/dashboard.service';
import { DashboardController } from './dashboard/dashboard.controller';
import { DashboardModule } from './dashboard/dashboard.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // <--- IMPORTANTE: Hace que el .env esté disponible en todos lados
    }),
    UsersModule,
    CategoriesModule,
    ProductsModule,
    SalesModule,
    AuthModule,
    CustomersModule,
    DashboardModule,
  ],
  controllers: [AppController, DashboardController],
  providers: [AppService, PrismaService, DashboardService],
})
export class AppModule {}
