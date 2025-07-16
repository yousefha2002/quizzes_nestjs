import { PointsValue } from './../../common/enums/points-value.enum';
import { Inject, Injectable } from '@nestjs/common';
import { repositories } from 'src/common/enums/repositories';
import { Points } from './entities/points.entity';
import { PointsType } from 'src/common/enums/points-type.enum';

@Injectable()
export class PointsService {

    constructor(
            @Inject(repositories.points_repository)
            private pointsModel : typeof Points,
    ){}
    async addPointsForAttempt(userId: number, attemptId: number,) 
    {
        return this.pointsModel.create({
        userId,
        attemptId,
        type: PointsType.ATTEMPT,
        points:PointsValue.ATTEMPT
        });
    }

    async addPointsForPassQuiz(userId: number, quizId: number) {
        return this.pointsModel.create({
        userId,
        quizId,
        type: PointsType.PASS_QUIZ,
        points:PointsValue.PASS_QUIZ
        });
    }

    async addPointsForCertificate(userId: number, certificateId: number) {
        return this.pointsModel.create({
        userId,
        certificateId,
        type: PointsType.CERTIFICATE,
        points:PointsValue.CERTIFICATE
        });
    }

    async hasAlreadyGotPassPoints(userId: number, quizId: number): Promise<boolean> {
        const exists = await this.pointsModel.findOne({
            where: {
            userId,
            quizId,
            type: PointsType.PASS_QUIZ,
            },
        });
        return !!exists;
    }
}
