import { Expose, Type } from 'class-transformer';
import { CategoryInfoDto } from 'src/modules/category/dto/category-info.dto';

export class LevelInfoDto {
    @Expose()
    title: string;

    @Expose()
    @Type(() => CategoryInfoDto)
    category: CategoryInfoDto;
}