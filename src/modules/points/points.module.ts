import { Module } from '@nestjs/common';
import { PointsService } from './points.service';
import { PointsController } from './points.controller';
import { PointsProvider } from './providers/points.provider';

@Module({
  controllers: [PointsController],
  providers: [PointsService,...PointsProvider],
})
export class PointsModule {}
