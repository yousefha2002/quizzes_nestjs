import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { PointsType } from 'src/common/enums/points-type.enum';
import { Attempt } from 'src/modules/attempt/entities/attempt.entity';
import { Certificate } from 'src/modules/certificate/entities/certificate.entity';
import { Quiz } from 'src/modules/quiz/entities/quiz.entity';
import { User } from 'src/modules/user/entities/user.entity';

@Table({ tableName: 'points', timestamps: true })
export class Points extends Model {
    @Column({ primaryKey: true, autoIncrement: true })
    id: number;

    @ForeignKey(() => User)
    @Column({ allowNull: false }) 
    userId: number;

    @Column({type: DataType.ENUM(...Object.values(PointsType)),allowNull: false, })
    type: string;

    @ForeignKey(() => Quiz)
    @Column({ allowNull: true })
    quizId: number;

    @ForeignKey(() => Attempt)
    @Column({ allowNull: true }) 
    attemptId: number;

    @ForeignKey(() => Certificate)
    @Column({ allowNull: true })
    certificateId: number;

    @BelongsTo(() => User)
    user: User;

    @BelongsTo(() => Quiz)
    quiz: Quiz;

    @BelongsTo(() => Attempt)
    attempt: Attempt;

    @BelongsTo(() => Certificate)
    certificate: Certificate;
}
