import { AttemptAnswerService } from './../attempt-answer/attempt-answer.service';
import { QuestionService } from './../question/question.service';
import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { repositories } from 'src/common/enums/repositories';
import { Attempt } from './entities/attempt.entity';
import { QuizService } from '../quiz/quiz.service';
import { AttemptStatus } from 'src/common/enums/attempt-status.enum';
import { AttemptAnswer } from '../attempt-answer/entities/attempt-answer.entity';
import { Question } from '../question/entities/question.entity';
import { Answer } from '../answer/entities/answer.entity';
import { Quiz } from '../quiz/entities/quiz.entity';
import { LevelProgressService } from '../level-progress/level-progress.service';
import { literal, Op } from 'sequelize';
import { Level } from '../level/entities/level.entity';
import { Category } from '../category/entities/category.entity';

@Injectable()
export class AttemptService {
    constructor(
        @Inject(repositories.attempt_repository)
        private attemptModel: typeof Attempt,  
        private quizService: QuizService,
        private questionService:QuestionService,
        private attemptAnswerService:AttemptAnswerService,

        @Inject(forwardRef(() => LevelProgressService))
        private levelProgressService:LevelProgressService
    ) {}

    async startAttempt(userId: number, quizId: number) 
    {
        const quiz = await this.quizService.checkIfExist(quizId);
        let attempt = await this.attemptModel.findOne({
            where: { userId, quizId, status: AttemptStatus.in_progress },
            include: [
                {
                model: AttemptAnswer,
                include: [{model:Question,include:[{model:Answer}]},{model:Answer}], 
                },
            ],
        });
        if(attempt)
        {
            return attempt
        }
        attempt = await this.attemptModel.create({userId,quizId,score: 0,status: AttemptStatus.in_progress,});
        const questions = await this.questionService.getRandomQuestionsForQuiz(quizId,quiz.numberOfQuestions)
        await this.attemptAnswerService.createAttemptAnswers(attempt.id,questions)
        return await this.attemptModel.findByPk(attempt.id, {
        include: [
            {
            model: AttemptAnswer,
            include: [{model:Question,include:[{model:Answer}]},{model:Answer}],
            },
        ],
        });
    }

    async updateAttemptAnswer(userId:number,attemptId: number, questionId: number, answerId: number)
    {
        const attempt = await this.attemptModel.findOne({where: { id: attemptId, userId, status: AttemptStatus.in_progress }});
        if (!attempt) {
            throw new NotFoundException('Attempt not found or not valid for update');
        }
        await this.attemptAnswerService.updateAttemptAnswer(attemptId, questionId, answerId);
        return { message: 'Answer updated successfully' };
    }

    async submitAttempt(userId: number, attemptId: number) 
    {
        const attempt = await this.attemptModel.findOne({
            where: { id: attemptId, userId, status: AttemptStatus.in_progress },
            include: [
            {
                model: AttemptAnswer,
                include: [
                {
                    model: Answer,
                    attributes: ['id', 'isCorrect'],
                },
                ],
            },
            ],
        });

        if (!attempt) {
            throw new NotFoundException('Attempt not found or already submitted');
        }

        let score = 0;
        for (const attemptAnswer of attempt.attemptAnswers) {
            if (attemptAnswer.answer?.isCorrect) {
            score++;
            }
        }

        attempt.score = score;
        const quiz = await this.quizService.checkIfExist(attempt.quizId);
        const percentage = (score / quiz.numberOfQuestions) * 100;

        attempt.status = percentage >= quiz.passScore ? AttemptStatus.passed : AttemptStatus.failed;
        attempt.submittedAt = new Date(); 
        await attempt.save();
        await this.attemptAnswerService.deleteAllAttemptAnswers(attemptId);

        if (percentage >= quiz.passScore) {
            await this.levelProgressService.updateLevelProgress(userId, quiz.levelId);
        }

        return {
            message: 'Attempt submitted successfully',
        };
    }

    async findSubmittedAttemptById(userId: number, attemptId: number) 
    {
        const attempt = await this.attemptModel.findOne({
            where: {
            id: attemptId,
            userId,
                status: [AttemptStatus.failed, AttemptStatus.passed],
            },
            include: [
            {
                model: Quiz,
            },
            ],
        });

        if (!attempt) {
            throw new NotFoundException('Submitted attempt not found');
        }

        return attempt;
    }

    async findCompletedQuizzesForLevel(userId: number, levelId: number) {
        const completedAttempts = await this.attemptModel.findAll({
            where: {
                userId,
                status: AttemptStatus.passed, 
            },
            include: [
                {
                    model: Quiz,
                    where: {
                        levelId,
                    },
                    attributes: [],
                },
            ],
            attributes: ['quizId'],
            group: ['quizId'],
            raw: true,
        });
        return completedAttempts;
    }

    async getUserQuizzes(userId: number, page = 1, limit = 1) {
        const offset = (page - 1) * limit;

        const attempts = await this.attemptModel.findAll({
            where: {
            userId,
            status: { [Op.in]: [AttemptStatus.passed, AttemptStatus.failed] },
            },
            include: [
            {
                model: Quiz,
                attributes: ['id', 'title', 'levelId'],
                include: [
                {
                    model: Level,
                    attributes: ['title'],
                    include: [
                    {
                        model: Category,
                        attributes: ['title'],
                    },
                    ],
                },
                ],
            },
            ],
            order: [['score', 'DESC']],
            raw: true,
            nest: true,
        });

        const summaryMap = new Map<
            number,
            {
            quiz: { id: number; title: string };
            levelTitle: string;
            categoryTitle: string;
            status: AttemptStatus.failed | AttemptStatus.passed;
            }
        >();

        for (const attempt of attempts) {
            const quizId = attempt.quiz.id;
            if (!summaryMap.has(quizId)) {
            summaryMap.set(quizId, {
                quiz: { id: attempt.quiz.id, title: attempt.quiz.title },
                levelTitle: attempt.quiz.level.title,
                categoryTitle: attempt.quiz.level.category.title,
                status: attempt.status === AttemptStatus.passed ? AttemptStatus.passed : AttemptStatus.failed,
            });
            }
        }

        const allSummaries = Array.from(summaryMap.values());
        const paginated = allSummaries.slice(offset, offset + limit);
        return {
            quizzes: paginated,
            totalPages: Math.ceil(allSummaries.length / limit),
        };
    }

    async getInProgressQuizzes(userId: number) 
    {
        return this.attemptModel.findAll({
            where: {
                userId,
                status: AttemptStatus.in_progress,
            },
            include: [
            {
                model: Quiz,
                include: [
                {
                    model: Level,
                    include: [
                    {
                        model: Category,
                    },
                    ],
                },
            ],
            },
        ],
            raw: false,
            nest: false,
        });
    }
}
