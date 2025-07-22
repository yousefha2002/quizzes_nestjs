import { Module } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { StatisticController } from './statistic.controller';
import { CertificateModule } from '../certificate/certificate.module';
import { AttemptModule } from '../attempt/attempt.module';
import { PointsModule } from '../points/points.module';

@Module({
  controllers: [StatisticController],
  providers: [StatisticService],
  imports:[CertificateModule,AttemptModule,PointsModule]
})
export class StatisticModule {}
