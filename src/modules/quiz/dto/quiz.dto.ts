import { Expose, Type } from 'class-transformer';
import { QuestionDto } from '../quiz-questions.dto';

export class QuizDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  headline: string;

  @Expose()
  numberOfQuestions: number;

  @Expose()
  passScore: number;

  @Expose()
  isPublished: boolean;

  @Expose()
  attemptsCount: number;

  @Expose()
  @Type(() => QuestionDto)
  questions: QuestionDto[];
}
