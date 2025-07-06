import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class loginUserDto {
  @IsEmail({}, { message: 'يرجى إدخال بريد إلكتروني صالح' })
  @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
  email: string;

  @IsString({ message: 'كلمة المرور يجب أن تكون نصًا' })
  @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
  password: string;
}
