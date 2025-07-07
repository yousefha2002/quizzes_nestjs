import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { QuestionProvider } from './providers/question.provider';
import { AnswerModule } from '../answer/answer.module';
import { QuizModule } from '../quiz/quiz.module';

@Module({
  controllers: [QuestionController],
  providers: [QuestionService,...QuestionProvider],
  imports:[AnswerModule,QuizModule]
})
export class QuestionModule {}
