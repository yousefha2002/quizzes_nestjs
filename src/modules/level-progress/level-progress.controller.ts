import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { LevelProgressService } from './level-progress.service';
import { UserGuard } from 'src/common/guards/user.guard';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { User } from '../user/entities/user.entity';
import { Serilaize } from 'src/common/interceptors/serialize.interceptor';
import { PaginatedLevelProgressDto } from './dto/level-progress.dto';

@Controller('level-progress')
export class LevelProgressController {
  constructor(private readonly levelProgressService: LevelProgressService) {}

  @Serilaize(PaginatedLevelProgressDto)
  @UseGuards(UserGuard)
  @Get('byUser')
  getStartedLevels(@CurrentUser() user:User,@Query('page') page: string ,@Query('limit') limit)
  {
    return this.levelProgressService.getStartedLevels(user.id,+page,+limit)
  }
}
