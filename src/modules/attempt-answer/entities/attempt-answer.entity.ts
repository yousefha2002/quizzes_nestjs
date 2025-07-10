import {Table,Column,Model,ForeignKey,BelongsTo,} from 'sequelize-typescript';
import { Question } from 'src/modules/question/entities/question.entity';
import { Answer } from 'src/modules/answer/entities/answer.entity';
import { Attempt } from 'src/modules/attempt/entities/attempt.entity';

@Table({ tableName: 'attempt_answers', timestamps: true })
export class AttemptAnswer extends Model {
    @Column({ primaryKey: true, autoIncrement: true })
    id: number;

    @ForeignKey(() => Attempt)
    @Column({ allowNull: false })
    attemptId: number;

    @ForeignKey(() => Question)
    @Column({ allowNull: false })
    questionId: number;

    @ForeignKey(() => Answer)
    @Column({ allowNull: true }) 
    answerId: number

    @BelongsTo(() => Attempt)
    attempt: Attempt;

    @BelongsTo(() => Question)
    question: Question;

    @BelongsTo(() => Answer)
    answer: Answer;
}
