import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { repositories } from 'src/common/enums/repositories';
import { Admin } from './entities/admin.entity';
import { comparePassword, hashPassword } from 'src/common/utils/password';
import { UserPasswordDto } from '../user/dto/user-password.dto';
import { generateToken } from 'src/common/utils/generateToken';
import { UserService } from '../user/user.service';

@Injectable()
export class AdminService {
  constructor(
    @Inject(repositories.admin_repository) private adminRepo: typeof Admin,
    private readonly userService: UserService,
  ) {}

  async signup(email: string, password: string) {
    const existingAdmin = await this.findOne();
    if (existingAdmin) {
      throw new BadRequestException('يوجد حساب أدمن مسجل في النظام');
    }
    const passwordHashed = await hashPassword(password);
    const admin = await this.create(email, passwordHashed);
    const payload = { adminId: admin.id };
    const access_token = generateToken(payload);
    return { admin: { id: admin.id, email: admin.email }, token: access_token };
  }

  async login(email: string, password: string) {
    const adminByEmail = await this.findByEmail(email);
    if (!adminByEmail) {
      throw new NotFoundException('الإيميل غير مستخدم');
    }
    const isMatch = await comparePassword(password, adminByEmail.password);
    if (!isMatch) {
      throw new BadRequestException('كلمة المرور خاطئة');
    }
    const payload = { adminId: adminByEmail.id };
    const access_token = generateToken(payload);
    return {
      admin: { id: adminByEmail.id, email: adminByEmail.email },
      token: access_token,
    };
  }

  async changePassword(body: UserPasswordDto) {
    const { oldPassword, newPassword } = body;
    const admin = await this.findOne();
    if (!admin) {
      throw new NotFoundException('حساب الأدمن غير موجود');
    }
    const isMatch = await comparePassword(oldPassword, admin.password);
    if (!isMatch) {
      throw new BadRequestException('كلمة المرور السابقة خاطئة');
    }
    const hashedPassword = await hashPassword(newPassword);
    admin.password = hashedPassword;
    await admin.save();
    return admin;
  }

  async changeEmail(newEmail: string) {
    const admin = await this.findOne();
    if (!admin) {
      throw new NotFoundException('حساب الأدمن غير موجود');
    }
    const adminByEmail = await this.findByEmail(newEmail);
    if (adminByEmail) {
      throw new BadRequestException('الإيميل مستخدم مسبقا');
    }
    admin.email = newEmail;
    await admin.save();
    return admin;
  }

  findByEmail(email: string) {
    return this.adminRepo.findOne({ where: { email } });
  }

  findOne() {
    return this.adminRepo.findOne();
  }

  async create(email: string, password: string) {
    const admin = await this.adminRepo.create({ email, password });
    await admin.save();
    return admin;
  }
}