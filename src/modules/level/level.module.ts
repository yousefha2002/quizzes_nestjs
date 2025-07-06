import { Module } from '@nestjs/common';
import { LevelService } from './level.service';
import { LevelController } from './level.controller';
import { LevelProvider } from './providers/level.provider';

@Module({
  controllers: [LevelController],
  providers: [LevelService,...LevelProvider],
})
export class LevelModule {}
