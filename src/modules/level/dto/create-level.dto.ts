import { Transform } from 'class-transformer';
import {IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateLevelDto {
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim().toLowerCase())
    title: string;

    @IsNumber()
    @IsNotEmpty()
    categoryId: number;
}