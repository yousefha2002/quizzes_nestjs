import { Expose, Type } from 'class-transformer';

export class AnswerDto {
    @Expose()
    id: number;

    @Expose()
    title: string;

    @Expose()
    isCorrect: boolean;
}

export class QuestionDto {
    @Expose()
    id: number;

    @Expose()
    title: string;

    @Expose()
    @Type(() => AnswerDto)
    answers: AnswerDto[];
}

export class QuizQuestionsDto {
    @Expose()
    id: number;

    @Expose()
    title: string;

    @Expose()
    @Type(() => QuestionDto)
    questions: QuestionDto[];
}