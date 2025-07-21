import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { UserGuard } from 'src/common/guards/user.guard';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { User } from '../user/entities/user.entity';

@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Get('me')
  @UseGuards(UserGuard)
  getUserStatistics(@CurrentUser() user:User)
  {
    return this.statisticService.getUserStatistics(user.id)
  }
}
