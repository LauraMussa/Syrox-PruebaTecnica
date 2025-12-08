import { OrderStatus } from './create-sale.dto';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class UpdateSaleStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsString()
  trackingId?: string;
}
