import { repositories } from 'src/common/enums/repositories';
import { Question } from '../entities/question.entity';

export const QuestionProvider = [
    {
        provide: repositories.question_repository,
        useValue: Question,
    },
];
