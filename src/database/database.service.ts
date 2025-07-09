import { Level } from 'src/modules/level/entities/level.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Sequelize } from 'sequelize-typescript';
import { Admin } from '../modules/admin/entities/admin.entity';
import { Answer } from 'src/modules/answer/entities/answer.entity';
import { Quiz } from 'src/modules/quiz/entities/quiz.entity';
import { QuizProgress } from 'src/modules/quiz-progress/entities/quiz-progress.entity';
import { LevelProgress } from 'src/modules/level-progress/entities/level-progress.entity';
import { Attempt } from 'src/modules/attempt/entities/attempt.entity';
import { Certificate } from 'src/modules/certificate/entities/certificate.entity';
import { Question } from 'src/modules/question/entities/question.entity';
import { Points } from 'src/modules/points/entities/points.entity';
import { Category } from 'src/modules/category/entities/category.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '2838293yo',
        // password: '059283805928388',
        database: 'quizzes_db',
      });
      sequelize.addModels([
        User,
        Admin,
        Level,
        Answer,
        Quiz,
        QuizProgress,
        LevelProgress,
        Attempt,
        Certificate,
        Question,
        Points,
        Category,
      ]);
      await sequelize.sync({ alter: false });
      return sequelize;
    },
  },
];
