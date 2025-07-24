import { IsString, IsNotEmpty, MinLength, MaxLength, IsOptional } from 'class-validator';

export class UpdateProfileDto {
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    @MinLength(3, { message: 'Name must be at least 3 characters' })
    @MaxLength(30, { message: 'Name must be at most 30 characters' })
    name: string;

    @IsOptional()
    @IsString({ message: 'Bio must be a string' })
    @MaxLength(500, { message: 'Bio must be at most 500 characters' })
    bio?: string;
}