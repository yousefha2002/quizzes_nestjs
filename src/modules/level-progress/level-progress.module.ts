import { Module } from '@nestjs/common';
import { LevelProgressService } from './level-progress.service';
import { LevelProgressController } from './level-progress.controller';
import { LevelProgressProvider } from './providers/level-progress.provider';

@Module({
  controllers: [LevelProgressController],
  providers: [LevelProgressService,...LevelProgressProvider],
})
export class LevelProgressModule {}
