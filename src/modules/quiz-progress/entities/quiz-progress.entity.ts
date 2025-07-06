import {Table,Column,Model,DataType,ForeignKey,BelongsTo,} from 'sequelize-typescript';
import { Quiz } from 'src/modules/quiz/entities/quiz.entity';
import { User } from 'src/modules/user/entities/user.entity';

@Table({ tableName: 'quiz_progresses', timestamps: true })
export class QuizProgress extends Model {
    @Column({ primaryKey: true, autoIncrement: true })
    id: number;

    @ForeignKey(() => User)
    @Column({ allowNull: false }) 
    userId: number;

    @ForeignKey(() => Quiz)
    @Column({ allowNull: false }) 
    quizId: number;

    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 }) 
    currentQuestionIndex: number;

    @Column({ type: DataType.JSON, allowNull: false, defaultValue: [] }) 
    questionsJson: any;

    @BelongsTo(() => User)
    user: User;

    @BelongsTo(() => Quiz)
    quiz: Quiz;
}