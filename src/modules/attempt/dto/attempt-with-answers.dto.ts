import { Expose, Type } from 'class-transformer';
import { AnswerDto, QuestionDto } from 'src/modules/quiz/quiz-questions.dto';

export class AttemptAnswerItemDto {
    @Expose()
    @Type(() => QuestionDto)
    question: QuestionDto;

    @Expose()
    @Type(() => AnswerDto)
    answer: AnswerDto | null;
}

export class AttemptWithAnswersDto {
    @Expose()
    id: number;

    @Expose()
    status: string;

    @Expose()
    @Type(() => AttemptAnswerItemDto)
    attemptAnswers: AttemptAnswerItemDto[];
}
