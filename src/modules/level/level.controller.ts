import { Body, Controller, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { LevelService } from './level.service';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';

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
}
