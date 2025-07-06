import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Answer } from 'src/modules/answer/entities/answer.entity';
import { Quiz } from 'src/modules/quiz/entities/quiz.entity';

@Table({ tableName: 'questions', timestamps: true, paranoid: true })
export class Question extends Model {
    @Column({ primaryKey: true, autoIncrement: true })
    id: number;

    @Column({ type: DataType.STRING, allowNull: false })
    title: string;

    @ForeignKey(() => Quiz)
    @Column({ allowNull: false })
    quizId: number;

    @BelongsTo(() => Quiz)
    quiz: Quiz;

    @HasMany(() => Answer)
    answers: Answer[];
}