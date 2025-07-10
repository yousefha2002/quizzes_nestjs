import { forwardRef, Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { QuizProvider } from './providers/quiz.provider';
import { LevelModule } from '../level/level.module';
import { QuestionModule } from '../question/question.module';

@Module({
  controllers: [QuizController],
  providers: [QuizService,...QuizProvider],
  imports:[LevelModule, forwardRef(() => QuestionModule)],
  exports:[QuizService]
})
export class QuizModule {}
