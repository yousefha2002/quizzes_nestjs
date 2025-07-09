import { Transform } from 'class-transformer';
import {IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateLevelDto {
    @IsString()
    @IsOptional()
    @IsNotEmpty({ message: 'Title must not be empty or blank' })
    @Transform(({ value }) => value.trim().toLowerCase())
    title?: string;
}
