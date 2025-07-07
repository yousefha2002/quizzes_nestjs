import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { QuizProvider } from './providers/quiz.provider';
import { LevelModule } from '../level/level.module';

@Module({
  controllers: [QuizController],
  providers: [QuizService,...QuizProvider],
  imports:[LevelModule],
  exports:[QuizService]
})
export class QuizModule {}
