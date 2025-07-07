import {IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateLevelDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsNumber()
    @IsNotEmpty()
    categoryId: number;
}