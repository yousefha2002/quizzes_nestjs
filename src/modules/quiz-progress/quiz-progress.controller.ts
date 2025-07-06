import { Controller } from '@nestjs/common';
import { QuizProgressService } from './quiz-progress.service';

@Controller('quiz-progress')
export class QuizProgressController {
  constructor(private readonly quizProgressService: QuizProgressService) {}
}
