import { Expose } from 'class-transformer';

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
}
