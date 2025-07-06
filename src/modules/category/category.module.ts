import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryProvider } from './providers/category.provider';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService,...CategoryProvider],
})
export class CategoryModule {}
