import { Module } from '@nestjs/common';
import { AttemptService } from './attempt.service';
import { AttemptController } from './attempt.controller';
import { AttemptProvider } from './providers/attempt.provider';

@Module({
  controllers: [AttemptController],
  providers: [AttemptService,...AttemptProvider],
})
export class AttemptModule {}
