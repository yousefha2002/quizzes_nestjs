import { Expose } from 'class-transformer';

export class LevelDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  isPublished: boolean;

  @Expose()
  quizCount: number;
}
