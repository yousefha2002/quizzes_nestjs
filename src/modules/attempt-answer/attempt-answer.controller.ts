import { Controller } from '@nestjs/common';
import { AttemptAnswerService } from './attempt-answer.service';

@Controller('attempt-answer')
export class AttemptAnswerController {
  constructor(private readonly attemptAnswerService: AttemptAnswerService) {}
}
