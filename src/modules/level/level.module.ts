import { Module } from '@nestjs/common';
import { LevelService } from './level.service';
import { LevelController } from './level.controller';
import { LevelProvider } from './providers/level.provider';
import { CategoryModule } from '../category/category.module';

@Module({
  controllers: [LevelController],
  providers: [LevelService,...LevelProvider],
  imports:[CategoryModule],
  exports:[LevelService]
})
export class LevelModule {}
