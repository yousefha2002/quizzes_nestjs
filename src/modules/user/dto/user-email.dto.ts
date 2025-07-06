import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserEmailDto {
  @IsEmail({}, { message: 'يرجى إدخال بريد إلكتروني صالح' })
  @IsNotEmpty({ message: 'البريد الإلكتروني الجديد مطلوب' })
  newEmail: string;
}
