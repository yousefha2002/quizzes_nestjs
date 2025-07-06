import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Attempt } from 'src/modules/attempt/entities/attempt.entity';
import { Certificate } from 'src/modules/certificate/entities/certificate.entity';
import { LevelProgress } from 'src/modules/level-progress/entities/level-progress.entity';
import { Points } from 'src/modules/points/entities/points.entity';
import { QuizProgress } from 'src/modules/quiz-progress/entities/quiz-progress.entity';

@Table({ tableName: 'users', timestamps: true })
export class User extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false,unique: true })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @HasMany(() => QuizProgress)
  quizProgresses: QuizProgress[];

  @HasMany(() => Attempt)
  attempts: Attempt[];

  @HasMany(() => Certificate)
  certificates: Certificate[];

  @HasMany(() => Points)
  points: Points[];

  @HasMany(() => LevelProgress)
  levelProgresses: LevelProgress[];
}