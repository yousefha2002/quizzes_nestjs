import { Injectable } from '@nestjs/common';
import { AttemptService } from '../attempt/attempt.service';
import { PointsService } from '../points/points.service';
import { CertificateService } from '../certificate/certificate.service';

@Injectable()
export class StatisticService {
    constructor(
        private readonly attemptService: AttemptService,
        private readonly pointsService: PointsService,
        private readonly certificateService: CertificateService,
    ){}
    async getUserStatistics(userId: number) 
    {
        const [
            totalAttempts,
            passedQuizzes,
            totalPoints,
            certificateCount,
        ] = await Promise.all([
            this.attemptService.countAllAttempts(userId),
            this.attemptService.countPassedQuizzes(userId),
            this.pointsService.getUserPointsCount(userId),
            this.certificateService.countUserCertificates(userId),
        ]);

        return {
            totalAttempts,
            passedQuizzes,
            totalPoints,
            certificateCount,
        };
    }
}
