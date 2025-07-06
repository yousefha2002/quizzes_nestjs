import { repositories } from 'src/common/enums/repositories';
import { Quiz } from '../entities/quiz.entity';

export const QuizProvider = [
    {
        provide: repositories.quiz_repository,
        useValue: Quiz,
    },
];
