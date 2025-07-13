import { AttemptService } from './../attempt/attempt.service';
import { QuizService } from './../quiz/quiz.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { repositories } from 'src/common/enums/repositories';
import { LevelProgress } from './entities/level-progress.entity';

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
}
