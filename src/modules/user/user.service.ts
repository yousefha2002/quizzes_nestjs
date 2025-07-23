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
import { Op, QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Points } from '../points/entities/points.entity';

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

  async changeEmail(newEmail: string, user: User) {
    const userByEmail = await this.findByEmail(newEmail);
    if (userByEmail) {
      throw new BadRequestException('Email is already in use');
    }
    user.email = newEmail;
    await user.save();
    return { message: 'user email has changed successfully' };
  }

  async changeName(newName: string, user: User) {
    user.name = newName;
    await user.save();
    return { message: 'User name has been changed successfully' };
  }

  async changePassword(body: UserPasswordDto, user: User) {
    const { oldPassword, newPassword } = body;
    const isMatch = await comparePassword(oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Incorrect old password');
    }
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();
    return { message: 'user password has changed successfully' };
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
      attributes: {
        include: [
          [
            Sequelize.literal(`(
                  SELECT COUNT(*)
                  FROM points AS a
                  WHERE a.userId = User.id
                )`),
            'pointsCount',
          ],
        ],
      },
      raw: true,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
    return {
      users: rows,
      totalPages: Math.ceil(count / limit),
    };
  }

  async getTopUsers(limit = 10) {
    const users = await this.userRepo.findAll({
      attributes: [
        'id',
        'name',
        [
          Sequelize.fn(
            'COALESCE',
            Sequelize.fn('SUM', Sequelize.col('points.points')),
            0,
          ),
          'pointsCount',
        ],
      ],
      include: [
        {
          model: Points,
          attributes: [],
          required: false,
        },
      ],
      group: ['User.id'],
      order: [[Sequelize.literal('pointsCount'), 'DESC']],
      limit,
      raw: true,
      subQuery: false,
    });

    return users;
  }
}
