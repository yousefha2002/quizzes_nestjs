import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateQuizDto {
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim().toLowerCase())
    title?: string;

    @IsString()
    @IsOptional()
    headline?: string;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    levelId?: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    numberOfQuestions?: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    passScore?: number;
}