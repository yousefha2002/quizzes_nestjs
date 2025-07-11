import { Expose, Type } from "class-transformer";

export class LevelWithProgressDto {
    @Expose()
    id: number;

    @Expose()
    title: string;

    @Expose()
    totalQuizzes: number;

    @Expose()
    completedQuizzes: number;
}