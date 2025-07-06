import {Body,Controller,Post,} from '@nestjs/common';
import { UserService } from './user.service';
import { createUserDto } from './dto/create-user.dto';
import { loginUserDto } from './dto/login-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signUpUser(
    @Body() body: createUserDto,
  ) {
    return this.userService.signUp(body);
  }

  @Post('login')
  async loginUser(@Body() body: loginUserDto) {
    return this.userService.login(body);
  }
}
