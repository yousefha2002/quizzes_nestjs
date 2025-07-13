import { Expose } from 'class-transformer';

export class LevelBaseDto {
    @Expose()
    id: number;

    @Expose()
    title: string;

    @Expose()
    quizCount: number;
}
