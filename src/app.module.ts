import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';
import { AdminModule } from './modules/admin/admin.module';
import { JwtModule } from '@nestjs/jwt';
import { CategoryModule } from './modules/category/category.module';
import { LevelModule } from './modules/level/level.module';
import { QuizModule } from './modules/quiz/quiz.module';
import { QuestionModule } from './modules/question/question.module';
import { AnswerModule } from './modules/answer/answer.module';
import { AttemptModule } from './modules/attempt/attempt.module';
import { CertificateModule } from './modules/certificate/certificate.module';
import { PointsModule } from './modules/points/points.module';
import { LevelProgressModule } from './modules/level-progress/level-progress.module';
import { AttemptAnswerModule } from './modules/attempt-answer/attempt-answer.module';
import { StatisticModule } from './modules/statistic/statistic.module';

@Module({
    imports: [
        JwtModule.register({ global: true, secret: 'token' }),
        DatabaseModule,
        UserModule,
        AdminModule,
        CategoryModule,
        LevelModule,
        QuizModule,
        QuestionModule,
        AnswerModule,
        AttemptModule,
        CertificateModule,
        PointsModule,
        LevelProgressModule,
        AttemptAnswerModule,
        StatisticModule,
    ]
})
export class AppModule {}