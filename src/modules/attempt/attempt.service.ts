import { AttemptAnswerService } from './../attempt-answer/attempt-answer.service';
import { QuestionService } from './../question/question.service';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { repositories } from 'src/common/enums/repositories';
import { Attempt } from './entities/attempt.entity';
import { QuizService } from '../quiz/quiz.service';
import { AttemptStatus } from 'src/common/enums/attempt-status.enum';
import { AttemptAnswer } from '../attempt-answer/entities/attempt-answer.entity';
import { Question } from '../question/entities/question.entity';
import { Answer } from '../answer/entities/answer.entity';

@Injectable()
export class AttemptService {
    constructor(
        @Inject(repositories.attempt_repository)
        private attemptModel: typeof Attempt,  
        private quizService: QuizService,
        private questionService:QuestionService,
        private attemptAnswerService:AttemptAnswerService
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
}
