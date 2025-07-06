import { Module } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';
import { AnswerProvider } from './providers/answer.provider';

@Module({
  controllers: [AnswerController],
  providers: [AnswerService,...AnswerProvider],
})
export class AnswerModule {}
