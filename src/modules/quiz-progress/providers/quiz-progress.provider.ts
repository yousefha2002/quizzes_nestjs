import { repositories } from 'src/common/enums/repositories';
import { QuizProgress } from '../entities/quiz-progress.entity';

export const QuizProgressProvider = [
    {
        provide: repositories.quiz_progress_repository,
        useValue: QuizProgress,
    },
];
