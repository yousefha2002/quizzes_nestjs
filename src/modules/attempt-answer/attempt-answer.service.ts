import { AttemptAnswer } from './entities/attempt-answer.entity';
import { Inject, Injectable } from '@nestjs/common';
import { repositories } from 'src/common/enums/repositories';
import { Question } from '../question/entities/question.entity';

@Injectable()
export class AttemptAnswerService {
    constructor(
        @Inject(repositories.attempt_answer_repository)
        private attemptAnswerModel: typeof AttemptAnswer, 
    ) {}

    async createAttemptAnswers(attemptId: number, questions: Question[]) 
    {
        const attemptAnswers = questions.map(q => ({
            attemptId,
            questionId: q.id,
            answerId: null,
        }));
        await this.attemptAnswerModel.bulkCreate(attemptAnswers);
    }
}