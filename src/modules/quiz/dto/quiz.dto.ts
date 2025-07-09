import { Expose } from 'class-transformer';

export class QuizDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  numberOfQuestions: number;

  @Expose()
  isFrozen: boolean;
}
