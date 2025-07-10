import { Expose, Type } from 'class-transformer';
import { AnswerDto } from 'src/modules/quiz/quiz-questions.dto';

export class QuestionDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  quizId: number;

  @Expose()
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}