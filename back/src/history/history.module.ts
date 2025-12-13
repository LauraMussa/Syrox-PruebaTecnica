import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HistoryController } from './history.controller';

@Module({
  controllers: [HistoryController],
  providers: [PrismaService],
})
export class HistoryModule {}
