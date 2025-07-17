import { Expose, Type } from 'class-transformer';
import { LevelInfoDto } from 'src/modules/level/dto/level-info.dto';

class QuizDto {
    @Expose()
    title: string;

    @Expose()
    id: number;
}

class CertificateDto {
    @Expose()
    id: number;

    @Expose()
    @Type(() => LevelInfoDto)
    level: LevelInfoDto;
}


class AttemptDto{
    @Expose()
    id: number;
}

class PointsDto {
    @Expose()
    id:number

    @Expose()
    points: number;

    @Expose()
    type: string;

    @Expose()
    createdAt: Date;

    @Expose()
    @Type(() => QuizDto)
    quiz?: QuizDto;

    @Expose()
    @Type(() => CertificateDto)
    certificate?: CertificateDto;

    @Expose()
    @Type(() => AttemptDto)
    attempt?: AttemptDto;
}

export class PaginatedPointsDto {
    @Expose()
    @Type(() => PointsDto)
    points: PointsDto;

    @Expose()
    totalPages:number
}