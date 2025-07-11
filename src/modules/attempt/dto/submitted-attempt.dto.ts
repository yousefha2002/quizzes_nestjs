import { Expose, Type } from 'class-transformer';

class QuizInfoDto {
    @Expose()
    title: string;

    @Expose()
    passScore: number;

    @Expose()
    numberOfQuestions:number
}

export class SubmittedAttemptDto {
    @Expose()
    id: number;

    @Expose()
    score: number;

    @Expose()
    createdAt: Date;

    @Expose()
    submittedAt:Date;

    @Expose()
    @Type(() => QuizInfoDto)
    quiz: QuizInfoDto;
}
