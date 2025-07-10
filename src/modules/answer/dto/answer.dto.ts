<<<<<<< HEAD
import { Expose } from "class-transformer";

export class AnswerDto {
    @Expose()
    id: number;

    @Expose()
    title: string;
}
=======
import { Expose } from 'class-transformer';

export class AnswerDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  isCorrect: boolean;
}
>>>>>>> 64073417e3a831887c67e31ca6588cfcba1192a4
