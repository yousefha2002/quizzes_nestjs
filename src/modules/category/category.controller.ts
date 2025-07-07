import { Body, Controller, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

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
}
