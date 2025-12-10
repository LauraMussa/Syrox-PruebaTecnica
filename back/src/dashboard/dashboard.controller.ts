import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
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
