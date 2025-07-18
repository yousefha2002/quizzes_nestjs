import { Expose } from 'class-transformer';

export class QuizListDto {
    @Expose()
    id: number;

    @Expose()
    title: string;

    @Expose()
    numberOfQuestions: number;
}

export class QuizListLoggedInDto extends QuizListDto{
    @Expose()
    userStatus:string
} 