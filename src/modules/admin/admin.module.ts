import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AdminProvider } from './providers/admin.provider';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AdminController],
  providers: [AdminService, ...AdminProvider],
})
export class AdminModule {}
