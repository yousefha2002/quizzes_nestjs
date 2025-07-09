import { Expose } from 'class-transformer';

export class LevelVisitorDto {
    @Expose()
    id: string;

    @Expose()
    title: string;

    @Expose()
    quizCount: number;
}