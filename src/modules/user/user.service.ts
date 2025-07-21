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
import { Op } from 'sequelize';

@Injectable()
export class UserService {
  constructor(
    @Inject(repositories.user_repository) private userRepo: typeof User,
  ) {}

  async signUp(body: createUserDto) {
    const userByEmail = await this.findByEmail(body.email);
    if (userByEmail) {
      throw new BadRequestException('Email is already in use');
    }
    const passwordHased = await hashPassword(body.password);
    const user = await this.userRepo.create({
      ...body,
      password: passwordHased,
    });
    await user.save();
    const payload = { userId: user.id };
    const access_token = generateToken(payload);
    return { user: { id: user.id, email: user.email }, token: access_token };
  }

  async login(body: loginUserDto) {
    const userByEmail = await this.findByEmail(body.email);
    if (!userByEmail) {
      throw new NotFoundException('Email not found');
    }
    const isMatch = await comparePassword(body.password, userByEmail.password);
    if (!isMatch) {
      throw new BadRequestException('Incorrect password');
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
      throw new NotFoundException('User not found');
    }
    const userByEmail = await this.findByEmail(newEmail);
    if (userByEmail) {
      throw new BadRequestException('Email is already in use');
    }
    user.email = newEmail;
    await user.save();
    return {message:"user email has changed successfully"};
  }

  async changePassword(body: UserPasswordDto, userId: number) {
    const { oldPassword, newPassword } = body;
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isMatch = await comparePassword(oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Incorrect password');
    }
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();
    return {message:"user password has changed successfully"};
  }

  findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  findById(id: number) {
    return this.userRepo.findByPk(id);
  }

  async findAllForAdmin(page: number, limit: number, search: string) {
    const offset = (page - 1) * limit;
    const whereClause: any = {};
    if (search) {
      whereClause.name = { [Op.like]: `%${search}%` };
    }
    const { rows, count } = await this.userRepo.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
    return {
      users: rows,
      totalPages: Math.ceil(count / limit),
    };
  }
}
