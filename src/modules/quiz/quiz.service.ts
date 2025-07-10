<<<<<<< HEAD
import { QuestionService } from './../question/question.service';
import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
=======
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
>>>>>>> 64073417e3a831887c67e31ca6588cfcba1192a4
import { repositories } from 'src/common/enums/repositories';
import { Quiz } from './entities/quiz.entity';
import { LevelService } from '../level/level.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { Question } from '../question/entities/question.entity';
import { Level } from '../level/entities/level.entity';
import { Category } from '../category/entities/category.entity';
import { Op } from 'sequelize';

@Injectable()
export class QuizService {
<<<<<<< HEAD
    constructor(
        @Inject(repositories.quiz_repository)
        private quizModel: typeof Quiz, 
        private levelService: LevelService,

        @Inject(forwardRef(() => QuestionService))
        private questionService:QuestionService
    ) {}

    async create(dto: CreateQuizDto) {
        // Check if a quiz with the same title already exists
        const existing = await this.quizModel.findOne({
            where: {
                title: dto.title,
                levelId: dto.levelId,
            },
        });

        if (existing) {
            throw new BadRequestException('Quiz title already exists');
        }

        // Make sure the level exists
        const level = await this.levelService.findById(dto.levelId);
        if (!level) throw new BadRequestException('Level not found');
=======
  constructor(
    @Inject(repositories.quiz_repository)
    private quizModel: typeof Quiz,
    private levelService: LevelService,
  ) {}
>>>>>>> 64073417e3a831887c67e31ca6588cfcba1192a4

  async create(dto: CreateQuizDto) {
    // Check if a quiz with the same title already exists
    const existing = await this.quizModel.findOne({
      where: { title: dto.title },
    });
    if (existing) {
      throw new BadRequestException('Quiz title already exists');
    }

<<<<<<< HEAD
    async update(id: number, dto: UpdateQuizDto) 
    {
        const quiz = await this.findById(id);
        if (!quiz) throw new NotFoundException('Quiz not found');

        const hasAttempts = quiz.attempts && quiz.attempts.length > 0;
        const isLocked = quiz.isPublished || hasAttempts;

        if (isLocked) {
            if (
                dto.numberOfQuestions !== undefined ||
                dto.passScore !== undefined ||
                dto.levelId !== undefined
            ) {
                throw new BadRequestException(
                    'Cannot modify quiz structure after publishing or receiving attempts.',
                );
            }
        }

        if (dto.title !== undefined && dto.title !== quiz.title) {
            const levelIdToCheck = dto.levelId ?? quiz.levelId;

            const existing = await this.quizModel.findOne({
                where: {
                    title: dto.title,
                    levelId: levelIdToCheck,
                    id: { [Op.ne]: id },
                },
            });

            if (existing) {
                throw new BadRequestException(
                    'Another quiz with this title already exists in the same level.',
                );
            }

            quiz.title = dto.title;
        }

        if (dto.headline !== undefined) {
            quiz.headline = dto.headline;
        }

        if (!isLocked) {
            if (dto.numberOfQuestions !== undefined) {
                quiz.numberOfQuestions = dto.numberOfQuestions;
            }

            if (dto.passScore !== undefined) {
                quiz.passScore = dto.passScore;
            }

            if (dto.levelId !== undefined) {
                const level = await this.levelService.findById(dto.levelId);
                if (!level) throw new BadRequestException('Level not found');
                quiz.levelId = dto.levelId;
            }
        }
        await quiz.save();
        return { message: 'Quiz updated successfully' };
=======
    // Make sure the level exists
    const level = await this.levelService.findById(dto.levelId);
    if (!level) throw new BadRequestException('Level not found');

    // Create the quiz
    await this.quizModel.create({ ...dto });
    return { message: 'Quiz created successfully' };
  }

  async update(id: number, dto: UpdateQuizDto) {
    // Check if the quiz exists
    const quiz = await this.findById(id);
    if (!quiz) throw new NotFoundException('Quiz not found');

    // Determine if quiz is locked (already published or has attempts)
    const hasAttempts = quiz.attempts && quiz.attempts.length > 0;
    const isLocked = quiz.isPublished || hasAttempts;

    // If locked, structure-related fields cannot be updated
    if (isLocked) {
      if (
        dto.numberOfQuestions !== undefined ||
        dto.passScore !== undefined ||
        dto.levelId !== undefined
      ) {
        throw new BadRequestException(
          'Cannot modify quiz structure after publishing or receiving attempts.',
        );
      }
>>>>>>> 64073417e3a831887c67e31ca6588cfcba1192a4
    }

    // Check and update title
    if (dto.title !== undefined) {
      const existing = await this.quizModel.findOne({
        where: { title: dto.title },
      });

      // Make sure no other quiz has the same title
      if (existing && existing.id !== quiz.id) {
        throw new BadRequestException(
          'Another quiz with this title already exists',
        );
      }

      quiz.title = dto.title;
    }

    // Update headline if provided
    if (dto.headline !== undefined) {
      quiz.headline = dto.headline;
    }

    // If not locked, update structure-related fields
    if (!isLocked) {
      if (dto.numberOfQuestions !== undefined) {
        quiz.numberOfQuestions = dto.numberOfQuestions;
      }
      if (dto.passScore !== undefined) {
        quiz.passScore = dto.passScore;
      }
      if (dto.levelId !== undefined) {
        const level = await this.levelService.findById(dto.levelId);
        if (!level) throw new BadRequestException('Level not found');
        quiz.levelId = dto.levelId;
      }
    }

    // Save changes
    await quiz.save();

    return { message: 'Quiz updated successfully' };
  }

  async publish(id: number) {
    const quiz = await this.quizModel.findByPk(id, {
      include: [
        {
          model: Question,
          where: { deletedAt: null },
          required: false,
        },
      ],
    });
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    if (quiz.isPublished) {
      throw new BadRequestException('Quiz is already published');
    }
    if (!quiz.questions || quiz.questions.length < quiz.numberOfQuestions) {
      throw new BadRequestException(
        `Quiz must have at least ${quiz.numberOfQuestions} questions to be published`,
      );
    }
    quiz.isPublished = true;
    await quiz.save();
    return { message: 'Quiz published successfully' };
  }

  async findAllByLevelAndCategory(levelTitle: string, categoryTitle: string) {
    const level = await this.levelService.findByTitleAndCategory(
      levelTitle,
      categoryTitle,
    );
    if (!level) {
      throw new NotFoundException('Level not found or not published');
    }

    const quizzes = await this.quizModel.findAll({
      where: {
        levelId: level.id,
        isPublished: true,
      },
      order: [['createdAt', 'DESC']],
    });
    return quizzes;
  }

  async getPublicQuiz(
    levelTitle: string,
    categoryTitle: string,
    quizTitle: string,
  ) {
    const level = await this.levelService.findByTitleAndCategory(
      levelTitle,
      categoryTitle,
    );
    if (!level) throw new NotFoundException('Level not found');
    const quiz = await this.quizModel.findOne({
      where: {
        title: quizTitle.toLowerCase(),
        isPublished: true,
        levelId: level.id,
      },
      include: [
        {
          model: Level,
          include: [{ model: Category }],
        },
      ],
    });
    if (!quiz) throw new NotFoundException('Quiz not found');
    return quiz;
  }

  async findAllByLevelId(levelId: number) {
    const level = await this.levelService.findById(levelId);
    if (!level) {
      throw new NotFoundException('Level not found');
    }

<<<<<<< HEAD
    async getQuizQuestions(id: number) 
    {
        const quiz = await this.quizModel.findOne({
            where: {id, isPublished: true },
            include: [
            {
                model: Level,
                include: [Category],
            },
            ],
        });

        if (!quiz) throw new NotFoundException('Quiz not found');

        if (!quiz.level?.isPublished || !quiz.level.category?.isPublished)
            throw new BadRequestException('Level or Category is not published');

        const totalQuestions = await Question.count({
            where: {
            quizId: quiz.id,
            deletedAt: null,
            },
        });

        if (totalQuestions < quiz.numberOfQuestions) {
            throw new BadRequestException(
            `This quiz requires ${quiz.numberOfQuestions} questions, but only ${totalQuestions} are available.`
            );
        }

        const questions = await this.questionService.getRandomQuestionsForQuiz(quiz.id, quiz.numberOfQuestions);

        return {
            id: quiz.id,
            title: quiz.title,
            questions,
        };
}

    findById(id: number) {
        return this.quizModel.findByPk(id, {
            include: ['attempts'],
        });
    }

    async checkIfExist(id:number)
    {
        const quiz = await this.quizModel.findByPk(id)
        if(!quiz)
        {
            throw new NotFoundException('Quiz not found')
        }
        return quiz
    }
}
=======
    const quizzes = await this.quizModel.findAll({
      where: {
        levelId: level.id,
      },
      order: [['createdAt', 'DESC']],
    });
    return quizzes;
  }

  async getQuizQuestions(quizTitle: string) {
    const quiz = await this.quizModel.findOne({
      where: { title: quizTitle, isPublished: true },
      include: [
        {
          model: Level,
          include: [Category],
        },
      ],
    });

    if (!quiz) throw new NotFoundException('Quiz not found');

    if (!quiz.level?.isPublished || !quiz.level.category?.isPublished)
      throw new BadRequestException('Level or Category is not published');

    const totalQuestions = await Question.count({
      where: {
        quizId: quiz.id,
        deletedAt: null,
      },
    });

    if (totalQuestions < quiz.numberOfQuestions) {
      throw new BadRequestException(
        `This quiz requires ${quiz.numberOfQuestions} questions, but only ${totalQuestions} are available.`,
      );
    }

    const questions = await Question.findAll({
      where: {
        quizId: quiz.id,
        deletedAt: null,
      },
      include: [Answer],
      order: [Sequelize.literal('RAND()')],
      limit: quiz.numberOfQuestions,
    });

    return {
      id: quiz.id,
      title: quiz.title,
      questions,
    };
  }

  findById(id: number) {
    return this.quizModel.findByPk(id, {
      include: ['attempts'],
    });
  }

  async findByIdForAdmin(quizId: number) {
    const quiz = await this.quizModel.findByPk(quizId);
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    return quiz;
  }

  async getQuizDetailsForAdmin(quizId: number) {
    const quiz = await this.quizModel.findOne({
      where: { id: quizId },
      include: [
        {
          model: Question,
          include: [{ model: Answer }],
        },
      ],
    });
    if (!quiz) {
      throw new BadRequestException('Quiz not found');
    }
    return quiz;
  }
}
>>>>>>> 64073417e3a831887c67e31ca6588cfcba1192a4
