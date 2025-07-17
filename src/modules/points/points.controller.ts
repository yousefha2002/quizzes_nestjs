import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { PointsService } from './points.service';
import { UserGuard } from 'src/common/guards/user.guard';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { User } from '../user/entities/user.entity';
import { Serilaize } from 'src/common/interceptors/serialize.interceptor';
import { PaginatedPointsDto } from './dto/points.dto';

@Controller('points')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Serilaize(PaginatedPointsDto)
  @UseGuards(UserGuard)
  @Get('user')
  async getUserPoints(
  @CurrentUser() user:User,
  @Query('page')page:number,
  @Query('limit') limit:number
) {
  return await this.pointsService.getUserPoints(user.id, page, limit);
}
}
