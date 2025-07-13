import { Expose, Type } from 'class-transformer';
import { QuizInfoDto } from './quiz.-info.dto';

export class UserQuizDto {
    @Expose()
    @Type(() => QuizInfoDto)
    quiz: QuizInfoDto;
}

export class PaginatedUserQuizzesDto {
    @Expose()
    @Type(() => UserQuizDto)
    quizzes: UserQuizDto[];

    @Expose()
    totalPages: number;
}