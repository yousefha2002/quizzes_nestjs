import { Inject, Injectable } from '@nestjs/common';
import { Answer } from './entities/answer.entity';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { repositories } from 'src/common/enums/repositories';

@Injectable()
export class AnswerService {
    constructor(
        @Inject(repositories.answer_repository)
        private answerModel: typeof Answer,
    ) {}

    async createMany(questionId: number, answers: CreateAnswerDto[]) {
        const data = answers.map((answer) => ({
            title: answer.title,
            isCorrect: answer.isCorrect,
            questionId,
        }));

        await this.answerModel.bulkCreate(data);
    }

    async deleteByQuestionId(questionId: number) {
        await this.answerModel.destroy({ where: { questionId } });
    }
}
