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
import { col, fn, Op,QueryTypes, where } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { UpdateProfileDto } from './dto/update-profile.dto';

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

  async updateProfile(dto: UpdateProfileDto, user: User) {
    const { name, bio } = dto;
    if (name && name.toLowerCase() !== user.name.toLowerCase()) {
      const existingUser = await this.userRepo.findOne({
        where: {
          [Op.and]: [
            where(fn('LOWER', col('name')), name.toLowerCase()),
            { id: { [Op.ne]: user.id } },
          ],
        },
      });
      if (existingUser) {
        throw new BadRequestException('Name is already in use');
      }
      user.name = name;
    }
    user.bio = bio ?? user.bio;
    await user.save();
    return { message: 'Profile updated successfully' };
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

  async getTopUsers(limit = 10) 
  {
    const sql = `
    SELECT id, name, pointsCount, userRank FROM (
      SELECT 
        u.id,
        u.name,
        COALESCE(SUM(p.points), 0) AS pointsCount,
        RANK() OVER (ORDER BY COALESCE(SUM(p.points), 0) DESC) AS userRank
      FROM users u
      LEFT JOIN points p ON u.id = p.userId
      GROUP BY u.id, u.name
    ) ranked_users
    ORDER BY userRank
    LIMIT :limit
  `;

  const users = await this.userRepo.sequelize?.query(sql, {
    replacements: { limit },
    type: QueryTypes.SELECT,
  });

  return users;
  }

  async getUserRank(userId: number)
    {
      const sql = `
      SELECT id, name, pointsCount, userRank FROM (
        SELECT u.id,
              u.name,
              COALESCE(SUM(p.points), 0) AS pointsCount,
              RANK() OVER (ORDER BY COALESCE(SUM(p.points), 0) DESC) AS userRank
        FROM users u
        LEFT JOIN points p ON u.id = p.userId
        GROUP BY u.id, u.name
      ) ranked_users
      WHERE ranked_users.id = :userId
    `;

    const result = await this.userRepo.sequelize?.query(sql, {
      replacements: { userId },
      type: QueryTypes.SELECT,
    });

    if (!result || result.length === 0) return null;

    const user = result[0] as any;

    return {
      id: user.id,
      name: user.name,
      pointsCount: Number(user.pointsCount),
      userRank: Number(user.userRank),
    };
  }
}