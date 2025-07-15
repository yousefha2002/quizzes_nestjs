import { AttemptService } from './../attempt/attempt.service';
import { QuizService } from './../quiz/quiz.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { repositories } from 'src/common/enums/repositories';
import { LevelProgress } from './entities/level-progress.entity';
import { Level } from '../level/entities/level.entity';
import { Category } from '../category/entities/category.entity';
import { Quiz } from '../quiz/entities/quiz.entity';
import { LevelProgressDto } from './dto/level-progress.dto';

@Injectable()
export class LevelProgressService {
    constructor(
        @Inject(repositories.level_progress_repository)
        private levelProgressModel: typeof LevelProgress,
        
        @Inject(forwardRef(() => AttemptService))
        private attemptService:AttemptService
    ) {}

    async updateLevelProgress(userId: number, levelId: number) 
    {
        const completedQuizIds = await this.attemptService.findCompletedQuizzesForLevel(userId,levelId)
        const completedCount = completedQuizIds.length;
        if (completedCount === 0) {
            return null;
        }


        let progress = await this.levelProgressModel.findOne({
            where: { userId, levelId },
        });
        if (!progress) {
                progress = await this.levelProgressModel.create({
                userId,
                levelId,
                completedQuizzes: completedCount,
                lastUpdate: new Date()
            });
        } else {
            if (progress.completedQuizzes !== completedCount) {
            progress.completedQuizzes = completedCount;
            await progress.save();
            }
        }
        return progress;
    }

    async getStartedLevels(userId: number,page = 1, limit = 5) {
        const offset = (page - 1) * limit;
        const totalProgresses = await this.levelProgressModel.count({
            where: { userId },
        });
        const progresses = await this.levelProgressModel.findAll({
            where: { userId },
            include: [
            {
                model: Level,
                include: [
                {
                    model: Category,
                    where: { isPublished: true },
                    attributes: ['id', 'title'],
                },
                {
                    model: Quiz,
                    where: { isPublished: true },
                    required: false,
                    attributes: ['id'],
                },
                ],
            },
            ],
            offset,
            limit,
            order: [['createdAt', 'DESC']]
        });

        const results: LevelProgressDto[] = [];

        for (const progress of progresses) {
            const level = progress.level;

            if (level.updatedAt > progress.lastUpdate) {
            const updated = await this.updateLevelProgress(userId, level.id);
            if (updated) progress.completedQuizzes = updated.completedQuizzes;
            }

            results.push({
            id: progress.id,
            title: level.title,
            quizCount: level.quizzes?.length ?? 0,
            completedQuizzes: progress.completedQuizzes,
            category: {
                id: level.category.id,
                title: level.category.title,
            },
            });
        }
        const totalPages = Math.ceil(totalProgresses / limit);
        return {
            progresses: results,
            totalPages,
        }
    }

    async findByUserAndLevel(userId: number, levelId: number) {
        return this.levelProgressModel.findOne({
            where: {
            userId,
            levelId,
            },
        });
    }
}
