import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('products')
  getAllProdcuts() {
    return this.dashboardService.findAll();
  }

  @Get('inventory-stats')
  getInventoryStats() {
    return this.dashboardService.getInventoryStats();
  }
}
