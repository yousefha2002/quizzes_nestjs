import { Transform } from 'class-transformer';
import {IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim().toLowerCase())
    title: string;
}
