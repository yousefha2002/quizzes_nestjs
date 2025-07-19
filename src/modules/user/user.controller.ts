import { Body, Controller, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { createUserDto } from './dto/create-user.dto';
import { loginUserDto } from './dto/login-user.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { Serilaize } from 'src/common/interceptors/serialize.interceptor';
import { PaginatedUserDto } from './dto/user.dto';
import { UserGuard } from 'src/common/guards/user.guard';
import { UserEmailDto } from './dto/user-email.dto';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { User } from './entities/user.entity';
import { UserPasswordDto } from './dto/user-password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signUpUser(@Body() body: createUserDto) {
    return this.userService.signUp(body);
  }

  @Post('login')
  async loginUser(@Body() body: loginUserDto) {
    return this.userService.login(body);
  }

  @UseGuards(AdminGuard)
  @Serilaize(PaginatedUserDto)
  @Get('admin/all')
  async fetchAllByAdmin(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '5',
    @Query('search') search: string = '',
  ) {
    return this.userService.findAllForAdmin(+page, +limit, search);
  }

  @Put('email')
  @UseGuards(UserGuard)
  async changeEmail(@Body() dto:UserEmailDto,@CurrentUser() user:User)
  {
    return this.userService.changeEmail(dto.newEmail,user.id)
  }

  @Put('password')
  @UseGuards(UserGuard)
  async changePassword(@Body() dto:UserPasswordDto,@CurrentUser() user:User)
  {
    return this.userService.changePassword(dto,user.id)
  }
}
