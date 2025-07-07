import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { CreateAnswerDto } from 'src/modules/answer/dto/create-answer.dto';

class QuestionWithAnswersDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateAnswerDto)
    answers: CreateAnswerDto[];
}

export class CreateQuestionsForQuizDto {
    @IsNumber()
    quizId: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => QuestionWithAnswersDto)
    questions: QuestionWithAnswersDto[];
}
