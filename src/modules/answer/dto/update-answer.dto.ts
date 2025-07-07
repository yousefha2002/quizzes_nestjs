import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateAnswerDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsBoolean()
    isCorrect: boolean;
}