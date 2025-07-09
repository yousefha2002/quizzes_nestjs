import { Expose, Type } from 'class-transformer';

class CategoryInfoDto {
    @Expose()
    title: string;
}

class LevelInfoDto {
    @Expose()
    title: string;

    @Expose()
    @Type(() => CategoryInfoDto)
    category: CategoryInfoDto;
}

export class PublicQuizDto {
    @Expose()
    title: string;

    @Expose()
    headline: string;

    @Expose()
    numberOfQuestions: number;

    @Expose()
    passScore: number;

    @Expose()
    @Type(() => LevelInfoDto)
    level: LevelInfoDto;
}