import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class authAdminDto {
  @IsEmail({}, { message: 'يرجى إدخال بريد إلكتروني صالح' })
  email: string;

  @IsString({ message: 'كلمة المرور يجب أن تكون نصًا' })
  @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
  password: string;
}
