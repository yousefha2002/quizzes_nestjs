import { Expose, Type } from 'class-transformer';
import { QuizInfoDto } from 'src/modules/quiz/dto/quiz.-info.dto';

export class InProgressAttemptDto {
    @Expose()
    id: number;

    @Expose()
    createdAt: Date;

    @Expose()
    answeredCount:number

    @Expose()
    @Type(() => QuizInfoDto)
    quiz: QuizInfoDto;
}

export class PaginattedInProgressAttemptDto{
    @Expose()
    @Type(() => InProgressAttemptDto)
    attempts:InProgressAttemptDto[]

    @Expose()
    totalPages:number
}