import { Module } from '@nestjs/common';
import { AttemptService } from './attempt.service';
import { AttemptController } from './attempt.controller';
import { AttemptProvider } from './providers/attempt.provider';
import { QuizModule } from '../quiz/quiz.module';
import { QuestionModule } from '../question/question.module';
import { AttemptAnswerModule } from '../attempt-answer/attempt-answer.module';

@Module({
  controllers: [AttemptController],
  providers: [AttemptService,...AttemptProvider],
  imports:[QuizModule,QuestionModule,AttemptAnswerModule]
})
export class AttemptModule {}
