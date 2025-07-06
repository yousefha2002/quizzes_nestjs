import { repositories } from 'src/common/enums/repositories';
import { LevelProgress } from '../entities/level-progress.entity';

export const LevelProgressProvider = [
    {
        provide: repositories.level_progress_repository,
        useValue: LevelProgress,
    },
];
