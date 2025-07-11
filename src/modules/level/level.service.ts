import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Level } from './entities/level.entity';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { CategoryService } from '../category/category.service';
import { repositories } from 'src/common/enums/repositories';
import { Op } from 'sequelize';
import { Quiz } from '../quiz/entities/quiz.entity';
import { PublishStatus } from 'src/common/enums/publish-status.enum';
import { Sequelize } from 'sequelize-typescript';
import { Category } from '../category/entities/category.entity';

@Injectable()
export class LevelService {
  constructor(
    @Inject(repositories.level_repository)
    private levelModel: typeof Level,
    private categoryService: CategoryService,
  ) {}

  async create(dto: CreateLevelDto) {
    const categoryExists = await this.categoryService.findById(dto.categoryId);
    if (!categoryExists) {
      throw new BadRequestException('Category does not exist');
    }
    const existing = await this.levelModel.findOne({
      where: {
        title: dto.title,
        categoryId: dto.categoryId,
      },
    });
    if (existing) {
      throw new BadRequestException(
        'A level with this title already exists in the same category',
      );
    }
    await this.levelModel.create({
      title: dto.title,
      categoryId: dto.categoryId,
      lastUpdate: new Date(),
    });
    return { message: 'Level created successfully' };
  }

  async update(id: number, dto: UpdateLevelDto) {
    const level = await this.findById(id);
    if (!level) {
      throw new NotFoundException('Level not found');
    }
    if (dto.title !== undefined) {
      const existing = await this.levelModel.findOne({
        where: {
          title: dto.title,
          categoryId: level.categoryId,
          id: { [Op.ne]: id },
        },
      });

      if (existing) {
        throw new BadRequestException(
          'Another level with this title already exists in the same category',
        );
      }

      level.title = dto.title;
    }
    await level.save();
    return { message: 'Level updated successfully' };
  }

  async publish(id: number) {
    const level = await this.levelModel.findByPk(id, {
      include: [
        {
          model: Quiz,
          where: { isPublished: true },
          required: false,
        },
      ],
    });
    if (!level) {
      throw new NotFoundException('Level not found');
    }

    if (!level.quizzes || level.quizzes.length === 0) {
      throw new BadRequestException(
        'Cannot publish level without at least one published quiz',
      );
    }
    level.isPublished = true;
    await level.save();
    return { message: 'Level published successfully' };
  }

  findById(id: number) {
    return this.levelModel.findByPk(id);
  }

  async findAllPublishedByCategoryName(categoryName: string) {
    const category = await this.categoryService.findByName(categoryName);
    if (!category) throw new NotFoundException('Category not found');

    return this.findAllBase(category.id, PublishStatus.Published);
  }

  async findAllForAdmin(categoryId: number, status: PublishStatus) {
    return this.findAllBase(categoryId, status);
  }

  async findAllBase(categoryId: number, status: PublishStatus) {
    const levels = await this.levelModel.findAll({
      where: { categoryId, isPublished: status },
      attributes: {
        include: [
          [
            Sequelize.literal(`(
                              SELECT COUNT(*) 
                              FROM quizzes AS a 
                              WHERE a.levelId = Level.id
                            )`),
            'quizCount',
          ],
        ],
      },
      raw: true,
      order: [['createdAt', 'DESC']],
    });
    return levels;
  }

  async findLevel(levelId: number) {
    const level = await this.findById(levelId);
    if (!level) {
      throw new NotFoundException('Level not found');
    }
    return level;
  }

  async findByTitleAndCategory(levelTitle: string, categoryTitle: string) {
    const level = await this.levelModel.findOne({
      where: {
        title: levelTitle.toLowerCase(),
        isPublished: true,
      },
      include: [
        {
          model: Category,
          where: {
            title: categoryTitle.toLowerCase(),
            isPublished: true,
          },
          required: true,
        },
      ],
    });
    return level;
  }
}
