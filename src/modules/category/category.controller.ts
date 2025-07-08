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
import { CategoryService } from './category.service';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Serilaize } from 'src/common/interceptors/serialize.interceptor';
import { CategoryDto, PaginatedCategoriesDto } from './dto/category.dto';
import { PublishStatus } from 'src/common/enums/publish-status.enum';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(AdminGuard)
  @Post('create')
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  @UseGuards(AdminGuard)
  @Put('update/:id')
  updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoryService.update(+id, dto);
  }

  @UseGuards(AdminGuard)
  @Patch('publish/:id')
  async publishCategory(@Param('id') id: string) {
    return this.categoryService.publish(+id);
  }

  @UseGuards(AdminGuard)
  @Serilaize(PaginatedCategoriesDto)
  @Get('admin')
  async getAllByAdmin(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '5',
    @Query('status') status: number = PublishStatus.Published,
  ) {
    return this.categoryService.getAllForAdmin(+page, +limit, status);
  }

  @UseGuards(AdminGuard)
  @Serilaize(CategoryDto)
  @Get('admin/:categoryId')
  async getOneByAdmin(@Param('categoryId') categoryId: string) {
    return this.categoryService.findOneForAdmin(+categoryId);
  }
}
