import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateQuizDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    headline: string;

    @IsNumber()
    @IsNotEmpty()
    levelId: number;

    @IsNumber()
    @IsNotEmpty()
    numberOfQuestions: number;

    @IsNumber()
    @IsNotEmpty()
    passScore: number;
}
