import { IsInt,IsPositive} from 'class-validator';

export class UpdateAnswerDto {
    @IsInt()
    @IsPositive()
    attemptId: number;

    @IsInt()
    @IsPositive()
    questionId: number;

    @IsInt()
    @IsPositive()
    answerId: number
}