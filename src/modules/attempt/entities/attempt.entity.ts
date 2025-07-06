import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { AttemptStatus } from 'src/common/enums/attempt-status.enum';
import { Quiz } from 'src/modules/quiz/entities/quiz.entity';
import { User } from 'src/modules/user/entities/user.entity';

@Table({ tableName: 'attempts', timestamps: true })
export class Attempt extends Model {
    @Column({ primaryKey: true, autoIncrement: true })
    id: number;

    @ForeignKey(() => User)
    @Column
    userId: number;

    @ForeignKey(() => Quiz)
    @Column({ allowNull: false })
    @Column
    quizId: number;

    @Column(DataType.INTEGER)
    score: number;

    @Column({type: DataType.ENUM(...Object.values(AttemptStatus)),allowNull: false})
    status: 'failed' | 'passed';

    @BelongsTo(() => User)
    user: User;

    @BelongsTo(() => Quiz)
    quiz: Quiz;
}
