import { OrderStatus } from './create-sale.dto';
import { IsEnum, IsString } from 'class-validator';

export class UpdateSaleStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsString()
  trackingId?: string;

  @IsString()
  note?: string;
}
