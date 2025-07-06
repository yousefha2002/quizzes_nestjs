import { repositories } from 'src/common/enums/repositories';
import { Level } from '../entities/level.entity';

export const LevelProvider = [
    {
        provide: repositories.level_repository,
        useValue: Level,
    },
];
