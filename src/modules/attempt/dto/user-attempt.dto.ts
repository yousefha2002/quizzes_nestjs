import { Expose, Type } from 'class-transformer';
import { QuizInfoDto } from 'src/modules/quiz/dto/quiz.-info.dto';

export class UserAttemptDto {
    @Expose()
    id: number;

    @Expose()
    status: string;

    @Expose()
    score: number;

    @Expose()
    createdAt: Date;

    @Expose()
    submittedAt?: Date;
}

export class PaginattedUserAttemptDto{

    @Expose()
    @Type(() => QuizInfoDto)
    quiz: QuizInfoDto;

    @Expose()
    @Type(() => UserAttemptDto)
    attempts:UserAttemptDto[]

    @Expose()
    totalPages:number
}