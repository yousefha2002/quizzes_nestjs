import { repositories } from 'src/common/enums/repositories';
import { AttemptAnswer } from '../entities/attempt-answer.entity';

export const AttemptAnswerProvider = [
    {
        provide: repositories.attempt_answer_repository,
        useValue: AttemptAnswer,
    },
];