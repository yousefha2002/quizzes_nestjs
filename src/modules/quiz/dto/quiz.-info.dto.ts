import { Expose, Type } from 'class-transformer';
import { LevelInfoDto } from 'src/modules/level/dto/level-info.dto';

export class QuizInfoDto {
    @Expose()
    id: number;

    @Expose()
    title: string;

    @Expose()
    numberOfQuestions: number;

    @Expose()
    passScore?: number;

    @Expose()
    @Type(() => LevelInfoDto)
    level: LevelInfoDto;
}