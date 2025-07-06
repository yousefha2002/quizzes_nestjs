import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { QuizProvider } from './providers/quiz.provider';

@Module({
  controllers: [QuizController],
  providers: [QuizService,...QuizProvider],
})
export class QuizModule {}
