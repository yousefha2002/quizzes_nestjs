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
          where: { isPublished: true, isFrozen: false },
          required: false,
        },
      ],
    });
    if (!level) {
      throw new NotFoundException('Level not found');
    }

    if (!level.quizzes || level.quizzes.length === 0) {
      throw new BadRequestException(
        'Cannot publish level without at least one published and unfrozen quiz',
      );
    }
    level.isPublished = true;
    await level.save();
    return { message: 'Level published successfully' };
  }

  findById(id: number) {
    return this.levelModel.findByPk(id);
  }

  async findAllForAdmin(categoryId: number, status: PublishStatus) {
    const levels = await this.levelModel.findAll({
      where: { categoryId },
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
}
