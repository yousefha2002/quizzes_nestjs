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
import { QuizProgressModule } from './modules/quiz-progress/quiz-progress.module';
import { AttemptModule } from './modules/attempt/attempt.module';
import { CertificateModule } from './modules/certificate/certificate.module';
import { PointsModule } from './modules/points/points.module';
import { LevelProgressModule } from './modules/level-progress/level-progress.module';

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
        QuizProgressModule,
        AttemptModule,
        CertificateModule,
        PointsModule,
        LevelProgressModule,
    ]
})
export class AppModule {}