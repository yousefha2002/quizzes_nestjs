import { Expose, Type } from 'class-transformer';

export class CategoryInfoDto {
    @Expose()
    id: string;

    @Expose()
    title: string;
}

export class PaginatedCategoryInfoDto {
    @Expose()
    @Type(() => CategoryInfoDto)
    categories:CategoryInfoDto[]

    @Expose()
    totalPages:number
}