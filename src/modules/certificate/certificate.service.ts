import { AttemptService } from './../attempt/attempt.service';
import { LevelProgressService } from './../level-progress/level-progress.service';
import { QuizService } from './../quiz/quiz.service';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { repositories } from 'src/common/enums/repositories';
import { Certificate } from './entities/certificate.entity';
import { LevelService } from '../level/level.service';

@Injectable()
export class CertificateService {
    constructor(
        @Inject(repositories.certificate_repository)
        private certificateModel : typeof Certificate,

        private quizService: QuizService,
        private levelProgressService:LevelProgressService,
        private levelService:LevelService,
        private attemptService:AttemptService
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
        // ✅ البيانات محدثة
        completedCount = levelProgress.completedQuizzes;
        } else {
        // ❗ فيه تغييرات على الكويزات → لازم نعيد الحساب
        const completedQuizzes = await this.attemptService.findCompletedQuizzesForLevel(userId, levelId);
        completedCount = completedQuizzes.length;
        }

        // عدد الكويزات المنشورة لهذا المستوى
        const totalQuizzes = await this.quizService.countPublishedQuizzesForLevel(levelId);

        // تحقق من وجود شهادة سابقة
        const existingCertificate = await this.certificateModel.findOne({
            where: { userId, levelId },
        });

        // الحالة 1: المستخدم ما كمل كل الكويزات
        if (completedCount < totalQuizzes) {
            if (existingCertificate) {
            // عنده شهادة، بس في كويز جديد ما حله → تنبيه فقط
            return {
                message: 'A new quiz has been added. Please complete it to keep your certificate updated.',
            };
            } else {
            // ما عنده شهادة ولسه ما كمل الكويزات → نرفض إصدار الشهادة
            throw new BadRequestException('You must complete all quizzes to get the certificate');
            }
        }

        // الحالة 2: المستخدم كمل كل الكويزات

        if (existingCertificate) {
            // عنده شهادة مسبقة → نحدثها فقط إذا الكويزات تم تحديثها بعد إصدار الشهادة
            if (level.updatedAt > levelProgress.lastUpdate) {
            // تحديث فعلي حصل → نجدد تاريخ الشهادة
            existingCertificate.obtainedAt = new Date();
            await existingCertificate.save();

            return {
                message: 'Certificate updated after new quizzes were completed.',
            };
            }

            // لا يوجد تحديث جديد → الشهادة الحالية ما زالت صالحة
            return {
            certificate: existingCertificate,
            message: 'Certificate is valid.',
            isValid: true,
            needsUpdate: false,
            };
        }

        // الحالة 3: ما عنده شهادة وكمل كل الكويزات → نصدر شهادة جديدة
        const newCertificate = await this.certificateModel.create({
            userId,
            levelId,
            obtainedAt: new Date(),
        });

        return {
            message: 'Certificate issued successfully.',
        };
    }
}
