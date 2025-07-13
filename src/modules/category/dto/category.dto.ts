import { Expose, Type } from 'class-transformer';
import { CategoryInfoDto } from './category-info.dto';

export class CategoryDto extends CategoryInfoDto {
  @Expose()
  isPublished: boolean;

  @Expose()
  levelCount: number;
}

export class PaginatedCategoryDto {
    @Expose()
    @Type(() => CategoryDto)
    categories:CategoryDto[]

    @Expose()
    totalPages:number
}