import {
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class createUserDto {
  @IsEmail({}, { message: 'يرجى إدخال بريد إلكتروني صالح' })
  @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
  email: string;

  @IsString({ message: 'كلمة المرور يجب أن تكون نصًا' })
  @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
  password: string;

  @IsNotEmpty({ message: 'الاسم مطلوب' })
  @IsString({ message: 'الاسم يجب أن يكون نصًا' })
  name: string;
}
