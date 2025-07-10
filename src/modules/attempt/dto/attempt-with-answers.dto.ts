import { Expose, Type } from 'class-transformer';

class QuestionDto {
    @Expose()
    id: number;

    @Expose()
    title: string;
}

class AnswerDto {
    @Expose()
    id: number;

    @Expose()
    title: string;
}

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
