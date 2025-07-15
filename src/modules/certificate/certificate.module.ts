import { Module } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CertificateController } from './certificate.controller';
import { CertificateProvider } from './providers/certificate.provider';
import { LevelProgressModule } from '../level-progress/level-progress.module';
import { QuizModule } from '../quiz/quiz.module';
import { LevelModule } from '../level/level.module';
import { AttemptModule } from '../attempt/attempt.module';

@Module({
  controllers: [CertificateController],
  providers: [CertificateService,...CertificateProvider],
  imports:[LevelProgressModule,QuizModule,LevelModule,AttemptModule]
})
export class CertificateModule {}
