import { Expose, Type } from 'class-transformer';
import { CategoryInfoDto } from 'src/modules/category/dto/category-info.dto';
export class LevelProgressDto {
    @Expose()
    id: number;

    @Expose()
    title: string;

    @Expose()
    quizCount: number;

    @Expose()
    completedQuizzes: number;

    @Expose()
    @Type(() => CategoryInfoDto)
    category: CategoryInfoDto;
}

export class PaginatedLevelProgressDto {
    @Expose()
    @Type(() => LevelProgressDto)
    progresses:LevelProgressDto[]

    @Expose()
    totalPages:number
}