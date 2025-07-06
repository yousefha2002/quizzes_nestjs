import { IsNotEmpty, IsString } from 'class-validator';

export class UserPasswordDto {
  @IsString({ message: 'كلمة المرور الجديدة يجب أن تكون نصًا' })
  @IsNotEmpty({ message: 'كلمة المرور الجديدة مطلوبة' })
  newPassword: string;

  @IsString({ message: 'كلمة المرور القديمة يجب أن تكون نصًا' })
  @IsNotEmpty({ message: 'كلمة المرور القديمة مطلوبة' })
  oldPassword: string;
}
