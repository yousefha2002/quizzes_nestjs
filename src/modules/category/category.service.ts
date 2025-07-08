import { repositories } from 'src/common/enums/repositories';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Level } from '../level/entities/level.entity';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(repositories.category_repository)
    private categoryModel: typeof Category,
  ) {}

  async create(dto: CreateCategoryDto) {
    const existing = await this.categoryModel.findOne({
      where: { title: dto.title },
    });
    if (existing) {
      throw new BadRequestException('Category title already exists');
    }
    await this.categoryModel.create({ ...dto });
    return { message: 'Category created successfully' };
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const category = await this.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    const existing = await this.categoryModel.findOne({
      where: { title: dto.title },
    });
    if (existing && existing.id !== category.id) {
      throw new BadRequestException(
        'Another category with this title already exists',
      );
    }
    category.title = dto.title;
    await category.save();
    return { message: 'Category updated successfully' };
  }

  async publish(id: number) {
    const category = await this.categoryModel.findByPk(id, {
      include: [
        {
          model: Level,
          where: { isPublished: true },
          required: false,
        },
      ],
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    if (!category.levels || category.levels.length === 0) {
      throw new BadRequestException(
        'Cannot publish category without at least one published level',
      );
    }
    category.isPublished = true;
    await category.save();
    return { message: 'Category published successfully' };
  }

  findById(id: number) {
    return this.categoryModel.findByPk(id);
  }

  async getAllForAdmin(page: number, limit: number, status: number) {
    const offset = (page - 1) * limit;
    const whereClause: any = {
      isPublished: status,
    };
    const { rows, count } = await this.categoryModel.findAndCountAll({
      where: whereClause,
      attributes: {
        include: [
          [
            Sequelize.literal(`(
                  SELECT COUNT(*) 
                  FROM levels AS a 
                  WHERE a.categoryId = Category.id
                )`),
            'levelCount',
          ],
        ],
      },
      raw: true,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
    return {
      categories: rows,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findOneForAdmin(categoryId: number) {
    const category = await this.findById(categoryId);
    if (!category) {
      throw new BadRequestException('This is an invalid category');
    }
    return category;
  }
}
