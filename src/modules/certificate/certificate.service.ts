import { AttemptService } from './../attempt/attempt.service';
import { LevelProgressService } from './../level-progress/level-progress.service';
import { QuizService } from './../quiz/quiz.service';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { repositories } from 'src/common/enums/repositories';
import { Certificate } from './entities/certificate.entity';
import { LevelService } from '../level/level.service';
import { User } from '../user/entities/user.entity';
import { Level } from '../level/entities/level.entity';
import { Category } from '../category/entities/category.entity';
import { PointsService } from '../points/points.service';

@Injectable()
export class CertificateService {
    constructor(
        @Inject(repositories.certificate_repository)
        private certificateModel : typeof Certificate,

        private quizService: QuizService,
        private levelProgressService:LevelProgressService,
        private levelService:LevelService,
        private attemptService:AttemptService,
        private pointsService :PointsService
    ){}

    async generateCertificate(userId: number, levelId: number) 
    {
        const level = await this.levelService.findLevel(levelId);
        if (!level) throw new NotFoundException('Level not found');

        const levelProgress = await this.levelProgressService.findByUserAndLevel(userId, levelId);
        if (!levelProgress) {
            throw new NotFoundException('Level progress not found');
        }

        let completedCount: number;
        if (levelProgress.lastUpdate >= level.updatedAt) {
            completedCount = levelProgress.completedQuizzes;
        } else {
            const completedQuizzes = await this.attemptService.findCompletedQuizzesForLevel(userId, levelId);
            completedCount = completedQuizzes.length;
        }

        const totalQuizzes = await this.quizService.countPublishedQuizzesForLevel(levelId);

        const existingCertificate = await this.certificateModel.findOne({
            where: { userId, levelId },
        });

        if (completedCount < totalQuizzes) {
            if (existingCertificate) {
                return {
                    id: existingCertificate.id,
                    message: 'A new quiz has been added. Please complete it to keep your certificate updated.',
                };
            } else {
                throw new BadRequestException('You must complete all quizzes to get the certificate');
            }
        }

        if (existingCertificate) {
            if (level.updatedAt > levelProgress.lastUpdate) {
                existingCertificate.obtainedAt = new Date();
                await existingCertificate.save();

                return {
                    id: existingCertificate.id,
                    message: 'Certificate updated after new quizzes were completed.',
                };
            }

            return {
                id: existingCertificate.id,
                certificate: existingCertificate,
                message: 'Certificate is valid.',
                isValid: true,
                needsUpdate: false,
            };
        }

        const newCertificate = await this.certificateModel.create({
            userId,
            levelId,
            obtainedAt: new Date(),
        });

        await this.pointsService.addPointsForCertificate(userId,newCertificate.id,);

        return {
            id: newCertificate.id,
            message: 'Certificate issued successfully.',
        };
    }

    async getCertificate(userId:number,certificateId:number)
    {
        const certificate = await this.certificateModel.findOne({
            where:{userId,id:certificateId},
            include:[
                {model:User},
                {model:Level,include:[{model:Category}]}
        ]
        })
        if(!certificate)
        {
            throw new NotFoundException('certificate is not found')
        }
        return certificate
    }

    async getCertificates(userId:number,page=1,limit=10 )
    {
        const offset = (page - 1) * limit;

        const { rows, count } = await this.certificateModel.findAndCountAll({
        where: { userId },
        include: [
            {
                model: Level,
                include: [
                    {
                        model: Category,
                    },
                ],
            },
        ],
        order: [['obtainedAt', 'DESC']],
        limit,
        offset,
    });
    return {certificates:rows,totalPages: Math.ceil(count / limit)}
    }
}