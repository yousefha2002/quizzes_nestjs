import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryProvider } from './providers/category.provider';
import { AdminModule } from '../admin/admin.module';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService,...CategoryProvider],
  exports:[CategoryService],
  imports:[AdminModule]
})
export class CategoryModule {}
