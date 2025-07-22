import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class UserNameDto {
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    @MinLength(3, { message: 'Name must be at least 3 characters' })
    @MaxLength(30, { message: 'Name must be at most 30 characters' })
    name: string;
}
