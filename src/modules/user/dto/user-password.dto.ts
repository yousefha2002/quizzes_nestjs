import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UserPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(20, { message: 'Password must be at most 20 characters' })
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  oldPassword: string;
}
