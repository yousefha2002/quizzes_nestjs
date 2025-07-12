import { Expose, Type } from "class-transformer";

class QuizInfoDto {
    @Expose()
    id: number;

    @Expose()
    title: string;
    }

class UserQuizDto {
    @Expose()
    @Type(() => QuizInfoDto)
    quiz: QuizInfoDto;

    @Expose()
    levelTitle: string;

    @Expose()
    categoryTitle: string;

    @Expose()
    status: string
}

export class PaginatedUserQuizzesDto {
    @Expose()
    @Type(() => UserQuizDto)
    quizzes: UserQuizDto[];

    @Expose()
    totalPages: number;
}