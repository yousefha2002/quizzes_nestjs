import { forwardRef, Module } from '@nestjs/common';
import { LevelService } from './level.service';
import { LevelController } from './level.controller';
import { LevelProvider } from './providers/level.provider';
import { CategoryModule } from '../category/category.module';
import { AttemptModule } from '../attempt/attempt.module';
import { QuizModule } from '../quiz/quiz.module';
import { LevelProgressModule } from '../level-progress/level-progress.module';
import { AdminModule } from '../admin/admin.module';

@Module({
  controllers: [LevelController],
  providers: [LevelService,...LevelProvider],
  imports:[CategoryModule,forwardRef(()=>AttemptModule),forwardRef(() => QuizModule),LevelProgressModule,AdminModule],
  exports:[LevelService]
})
export class LevelModule {}
