<<<<<<< HEAD
import { Expose } from "class-transformer";

export class QuestionDto {
    @Expose()
    id: number;

    @Expose()
    title: string;
}
=======
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
>>>>>>> 64073417e3a831887c67e31ca6588cfcba1192a4
