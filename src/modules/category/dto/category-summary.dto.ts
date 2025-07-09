import { Expose, Type } from 'class-transformer';

export class CategorySummaryDto {
    @Expose()
    id: string;

    @Expose()
    title: string;
}

export class PaginatedCategoriesSummaryDto {
    @Expose()
    @Type(() => CategorySummaryDto)
    categories: CategorySummaryDto[];

    @Expose()
    totalPages: number;
}
