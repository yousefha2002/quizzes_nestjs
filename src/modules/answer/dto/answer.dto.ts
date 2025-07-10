import { Expose } from 'class-transformer';

export class AnswerDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  isCorrect: boolean;
}