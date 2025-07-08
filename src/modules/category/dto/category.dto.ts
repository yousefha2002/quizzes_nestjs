import { Expose, Type } from 'class-transformer';

export class CategoryDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  isPublished: boolean;

  @Expose()
  levelCount: number;
}

export class PaginatedCategoriesDto {
  @Expose()
  @Type(() => CategoryDto)
  categories: CategoryDto[];

  @Expose()
  totalPages: number;
}
