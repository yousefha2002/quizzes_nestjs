import { PointsValue } from './../../common/enums/points-value.enum';
import { Inject, Injectable } from '@nestjs/common';
import { repositories } from 'src/common/enums/repositories';
import { Points } from './entities/points.entity';
import { PointsType } from 'src/common/enums/points-type.enum';
import { Quiz } from '../quiz/entities/quiz.entity';
import { Certificate } from '../certificate/entities/certificate.entity';
import { Level } from '../level/entities/level.entity';
import { Attempt } from '../attempt/entities/attempt.entity';
import { Category } from '../category/entities/category.entity';

@Injectable()
export class PointsService {

    constructor(
            @Inject(repositories.points_repository)
            private pointsModel : typeof Points,
    ){}
    async addPointsForAttempt(userId: number, attemptId: number,quizId: number) 
    {
        return this.pointsModel.create({
        userId,
        attemptId,
        quizId,
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

    async getUserPoints(userId: number, page = 1, limit = 10) 
    {
        const offset = (page - 1) * limit;

        const totalPointsCount = await this.pointsModel.count({
            where: { userId },
        });

        const points = await this.pointsModel.findAll({
            where: { userId },
            include: [
            {
                model: Quiz,
            },
            {
                model:Attempt
            }
            ,
            {
                model: Certificate,
                include: [
                {
                    model: Level,
                    include:[{model:Category}]
                },
                ],
            },
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset,
        });

        const totalPages = Math.ceil(totalPointsCount / limit);

        return {
            points,
            totalPages,
        };
        }

}
