import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Op, Sequelize } from 'sequelize';

import { repositories } from 'src/common/enums/repositories';

import { Quiz } from './entities/quiz.entity';
import { LevelService } from '../level/level.service';
import { QuestionService } from '../question/question.service';

import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';

import { Question } from '../question/entities/question.entity';
import { Answer } from '../answer/entities/answer.entity';
import { Level } from '../level/entities/level.entity';
import { Category } from '../category/entities/category.entity';

@Injectable()
export class QuizService {
  constructor(
    @Inject(repositories.quiz_repository)
    private quizModel: typeof Quiz,

    private levelService: LevelService,

    @Inject(forwardRef(() => QuestionService))
    private questionService: QuestionService,
  ) {}

  async create(dto: CreateQuizDto) {
    // تحقق من عدم وجود اختبار بنفس العنوان في نفس المستوى
    const existing = await this.quizModel.findOne({
      where: {
        title: dto.title,
        levelId: dto.levelId,
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Quiz title already exists in the same level',
      );
    }

    // تحقق من وجود المستوى
    const level = await this.levelService.findById(dto.levelId);
    if (!level) {
      throw new BadRequestException('Level not found');
    }

    // إنشاء الاختبار
    await this.quizModel.create({ ...dto });
    return { message: 'Quiz created successfully' };
  }

  async update(id: number, dto: UpdateQuizDto) {
    // تحقق من وجود الاختبار
    const quiz = await this.findById(id);
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    // هل الاختبار منشور أو له محاولات؟
    const hasAttempts = quiz.attempts && quiz.attempts.length > 0;
    const isLocked = quiz.isPublished || hasAttempts;

    // منع تعديل بنية الاختبار إذا كان مقفلًا
    if (isLocked) {
      if (
        dto.numberOfQuestions !== undefined ||
        dto.passScore !== undefined ||
        dto.levelId !== undefined
      ) {
        throw new BadRequestException(
          'Cannot modify quiz structure after publishing or attempts',
        );
      }
    }

    // تحديث العنوان مع التحقق من عدم التكرار في نفس المستوى
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
          'Another quiz with this title already exists in the same level',
        );
      }
      quiz.title = dto.title;
    }

    // تحديث العنوان الفرعي
    if (dto.headline !== undefined) {
      quiz.headline = dto.headline;
    }

    // تحديث بنية الاختبار إذا لم يكن مقفلًا
    if (!isLocked) {
      if (dto.numberOfQuestions !== undefined) {
        quiz.numberOfQuestions = dto.numberOfQuestions;
      }

      if (dto.passScore !== undefined) {
        quiz.passScore = dto.passScore;
      }

      if (dto.levelId !== undefined) {
        const level = await this.levelService.findById(dto.levelId);
        if (!level) {
          throw new BadRequestException('Level not found');
        }
        quiz.levelId = dto.levelId;
      }
    }

    await quiz.save();

    return { message: 'Quiz updated successfully' };
  }

  async publish(id: number) {
    // جلب الاختبار مع الأسئلة المنشورة وغير المحذوفة
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
    // جلب المستوى بناءً على العنوان والفئة
    const level = await this.levelService.findByTitleAndCategory(
      levelTitle,
      categoryTitle,
    );

    if (!level) {
      throw new NotFoundException('Level not found or not published');
    }

    // جلب جميع الاختبارات المنشورة التابعة للمستوى
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
    if (!level) {
      throw new NotFoundException('Level not found');
    }

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

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    return quiz;
  }

  async findAllByLevelId(levelId: number) {
    const level = await this.levelService.findById(levelId);
    if (!level) {
      throw new NotFoundException('Level not found');
    }

    const quizzes = await this.quizModel.findAll({
      where: {
        levelId: level.id,
      },
      order: [['createdAt', 'DESC']],
    });

    return quizzes;
  }

  async getQuizQuestions(quizId: number) {
    // جلب الاختبار مع المستوى والفئة
    const quiz = await this.quizModel.findOne({
      where: { id: quizId, isPublished: true },
      include: [
        {
          model: Level,
          include: [Category],
        },
      ],
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    if (!quiz.level?.isPublished || !quiz.level.category?.isPublished) {
      throw new BadRequestException('Level or Category is not published');
    }

    // حساب عدد الأسئلة المنشورة وغير المحذوفة
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

    // جلب الأسئلة بشكل عشوائي مع الإجابات
    const questions = await this.questionService.getRandomQuestionsForQuiz(
      quizId,
      quiz.numberOfQuestions,
    );
    return {
      id: quiz.id,
      title: quiz.title,
      questions,
    };
  }

  findById(id: number) {
    return this.quizModel.findByPk(id, {
      include: ['attempts'], // جلب محاولات الاختبار مع النموذج
    });
  }

  async checkIfExist(id: number) {
    const quiz = await this.quizModel.findByPk(id);
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    return quiz;
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
          where: { deletedAt: null }, // ✅ Only include non-deleted questions
          required: false,
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
