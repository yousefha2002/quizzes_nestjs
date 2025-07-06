import { repositories } from 'src/common/enums/repositories';
import { Points } from '../entities/points.entity';

export const PointsProvider = [
    {
        provide: repositories.points_repository,
        useValue: Points,
    },
];
