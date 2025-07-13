import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LevelService } from './level.service';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { PublishStatus } from 'src/common/enums/publish-status.enum';
import { Serilaize } from 'src/common/interceptors/serialize.interceptor';
import { LevelAdminDto } from './dto/level-admin.dto';
import { LevelWithProgressDto } from './dto/level-with-progress.dto';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { User } from '../user/entities/user.entity';
import { UserGuard } from 'src/common/guards/user.guard';
import { LevelBaseDto } from './dto/level-base.dto';

@Controller('level')
export class LevelController {
  constructor(private readonly levelService: LevelService) {}

  @UseGuards(AdminGuard)
  @Post('create')
  createLevel(@Body() dto: CreateLevelDto) {
    return this.levelService.create(dto);
  }

  @UseGuards(AdminGuard)
  @Put('update/:id')
  updateLevel(@Param('id') id: string, @Body() dto: UpdateLevelDto) {
    return this.levelService.update(+id, dto);
  }

  @UseGuards(AdminGuard)
  @Patch('publish/:id')
  async publishLevel(@Param('id') id: string) {
    return this.levelService.publish(+id);
  }

  @UseGuards(AdminGuard)
  @Serilaize(LevelAdminDto)
  @Get('admin/byCategory/:categoryId')
  getLevelsByCategoryForAdmin(
    @Query('status') status: number = PublishStatus.Published,
    @Param('categoryId') categoryId: string,
  ) {
    return this.levelService.findAllForAdmin(+categoryId, status);
  }

  @Serilaize(LevelBaseDto)
  @Get('all/public/byCategory/:name')
  getLevelsByCategoryForVisitor(@Param('name') name: string) {
    return this.levelService.findAllPublishedByCategoryName(name.toLowerCase());
}

  @UseGuards(AdminGuard)
  @Serilaize(LevelAdminDto)
  @Get('admin/:levelId')
  findOnelForAdmin(@Param('levelId') levelId: string) {
    return this.levelService.findLevel(+levelId);
  }

  @UseGuards(UserGuard)
  @Serilaize(LevelWithProgressDto)
  @Get('all/byCategory/:name')
  getLevelsWithProgressByCategory(@Param('name') category: string,@CurrentUser() user:User) {
    return this.levelService.getLevelsWithProgressByCategory(+user.id,category);
  }
}
