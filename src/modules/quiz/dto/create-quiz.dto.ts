import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateQuizDto {
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim().toLowerCase())
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
