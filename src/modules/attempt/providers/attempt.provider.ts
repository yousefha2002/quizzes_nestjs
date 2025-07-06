import { repositories } from 'src/common/enums/repositories';
import { Attempt } from '../entities/attempt.entity';

export const AttemptProvider = [
    {
        provide: repositories.attempt_repository,
        useValue: Attempt,
    },
];
