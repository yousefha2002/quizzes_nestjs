import { Module } from '@nestjs/common';
import { AttemptAnswerService } from './attempt-answer.service';
import { AttemptAnswerController } from './attempt-answer.controller';
import { AttemptAnswerProvider } from './providers/attempt-answer.provider';

@Module({
  controllers: [AttemptAnswerController],
  providers: [AttemptAnswerService,...AttemptAnswerProvider],
  exports:[AttemptAnswerService]
})
export class AttemptAnswerModule {}
