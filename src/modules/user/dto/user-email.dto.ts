import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserEmailDto {
  @IsEmail()
  @IsNotEmpty()
  newEmail: string;
}
