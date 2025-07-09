import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { repositories } from 'src/common/enums/repositories';
import { Quiz } from './entities/quiz.entity';
import { LevelService } from '../level/level.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { Question } from '../question/entities/question.entity';
import { Level } from '../level/entities/level.entity';
import { Category } from '../category/entities/category.entity';

@Injectable()
export class QuizService {
    constructor(
        @Inject(repositories.quiz_repository)
        private quizModel: typeof Quiz, 
        private levelService: LevelService,
    ) {}

    async create(dto: CreateQuizDto) {
        // Check if a quiz with the same title already exists
        const existing = await this.quizModel.findOne({
            where: { title: dto.title },
        });
        if (existing) {
            throw new BadRequestException('Quiz title already exists');
        }

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
        }

        // Check and update title
        if (dto.title !== undefined) {
            const existing = await this.quizModel.findOne({
                where: { title: dto.title },
            });

            // Make sure no other quiz has the same title
            if (existing && existing.id !== quiz.id) {
                throw new BadRequestException('Another quiz with this title already exists');
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

    async publish(id: number) 
    {
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
            `Quiz must have at least ${quiz.numberOfQuestions} questions to be published`
            );
        }
        quiz.isPublished = true;
        await quiz.save();
        return { message: 'Quiz published successfully' };
    }


    async findAllByLevelAndCategory(levelTitle: string, categoryTitle: string) 
    {
        const level = await this.levelService.findByTitleAndCategory(levelTitle, categoryTitle);
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

    async getPublicQuiz(levelTitle: string, categoryTitle: string, quizTitle: string) 
    {
        const level = await this.levelService.findByTitleAndCategory(levelTitle, categoryTitle);
        if (!level) throw new NotFoundException('Level not found');
        const quiz = await this.quizModel.findOne({
            where: {
                id: quizTitle.toLowerCase(),
                isPublished: true,
                levelId: level.id,
            },
            include: [
            {
                model: Level,
                include: [{model:Category}],
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

        const quizzes = await this.quizModel.findAll({
        where: {
            levelId: level.id,
        },
        order: [['createdAt', 'DESC']],
        });
        return quizzes;
    }

    findById(id: number) {
        return this.quizModel.findByPk(id, {
            include: ['attempts'],
        });
    }
}