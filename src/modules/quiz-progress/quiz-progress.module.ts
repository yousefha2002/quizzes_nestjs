import { Module } from '@nestjs/common';
import { QuizProgressService } from './quiz-progress.service';
import { QuizProgressController } from './quiz-progress.controller';
import { QuizProgressProvider } from './providers/quiz-progress.provider';

@Module({
  controllers: [QuizProgressController],
  providers: [QuizProgressService,...QuizProgressProvider],
})
export class QuizProgressModule {}
