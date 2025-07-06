import { repositories } from 'src/common/enums/repositories';
import { Answer } from '../entities/answer.entity';

export const AnswerProvider = [
    {
        provide: repositories.answer_repository,
        useValue: Answer,
    },
];
