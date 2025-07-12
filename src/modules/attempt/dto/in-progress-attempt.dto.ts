import { Expose, Type } from 'class-transformer';

export class CategoryInfoDto {
    @Expose()
    title: string;
}

export class LevelInfoDto {
    @Expose()
    title: string;

    @Expose()
    @Type(() => CategoryInfoDto)
    category: CategoryInfoDto;
}

export class QuizInfoDto {
    @Expose()
    id: number;

    @Expose()
    title: string;

    @Expose()
    numberOfQuestions: number;

    @Expose()
    @Type(() => LevelInfoDto)
    level: LevelInfoDto;
}

export class InProgressAttemptDto {
    @Expose()
    id: number;

    @Expose()
    createdAt: Date;

    @Expose()
    @Type(() => QuizInfoDto)
    quiz: QuizInfoDto;
}