import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserInterceptor } from './interceptors/user.interceptor';
import { UserProvider } from './providers/user.provider';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    ...UserProvider,
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
