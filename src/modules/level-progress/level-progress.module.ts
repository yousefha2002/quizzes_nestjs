import { forwardRef, Module } from '@nestjs/common';
import { LevelProgressService } from './level-progress.service';
import { LevelProgressController } from './level-progress.controller';
import { LevelProgressProvider } from './providers/level-progress.provider';
import { AttemptModule } from '../attempt/attempt.module';

@Module({
  controllers: [LevelProgressController],
  providers: [LevelProgressService,...LevelProgressProvider],
  imports:[forwardRef(()=>AttemptModule)],
  exports:[LevelProgressService]
})
export class LevelProgressModule {}
