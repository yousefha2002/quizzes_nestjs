import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { repositories } from 'src/common/enums/repositories';
import { User } from './entities/user.entity';
import { createUserDto } from './dto/create-user.dto';
import { comparePassword, hashPassword } from 'src/common/utils/password';
import { loginUserDto } from './dto/login-user.dto';
import { UserPasswordDto } from './dto/user-password.dto';
import { generateToken } from 'src/common/utils/generateToken';

@Injectable()
export class UserService {
  constructor(@Inject(repositories.user_repository) private userRepo: typeof User) {}

  async signUp(body: createUserDto, imageUrl?: string) {
    const userByEmail = await this.findByEmail(body.email);
    if (userByEmail) {
      throw new BadRequestException('الايميل مستخدم من قبل');
    }
    const passwordHased = await hashPassword(body.password);
    const user = await this.userRepo.create({...body,password: passwordHased});
    await user.save();
    const payload = { userId: user.id };
    const access_token = generateToken(payload);
    return { user: { id: user.id, email: user.email }, token: access_token };
  }

  async login(body: loginUserDto) {
    const userByEmail = await this.findByEmail(body.email);
    if (!userByEmail) {
      throw new NotFoundException('الإيميل غير مستخدم');
    }
    const isMatch = await comparePassword(body.password, userByEmail.password);
    if (!isMatch) {
      throw new BadRequestException('كلمة المرور خاطئة');
    }
    const payload = { userId: userByEmail.id };
    const access_token = generateToken(payload);
    return {
      user: { id: userByEmail.id, email: userByEmail.email },
      token: access_token,
    };
  }

  async changeEmail(newEmail: string, userId: number) {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('المستخدم غير متوفر');
    }
    const userByEmail = await this.findByEmail(newEmail);
    if (userByEmail) {
      throw new BadRequestException('الايميل مستهدم من قبل');
    }
    user.email = newEmail;
    await user.save();
    return user;
  }

  async changePassword(body: UserPasswordDto, userId: number) {
    const { oldPassword, newPassword } = body;
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('المتسخدم غير متوفر');
    }
    const isMatch = await comparePassword(oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('كلمة المرور خاطئة');
    }
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();
    return user;
  }

  findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  findById(id: number) {
    return this.userRepo.findByPk(id);
  }
}