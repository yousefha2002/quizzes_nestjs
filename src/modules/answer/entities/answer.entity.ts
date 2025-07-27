import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { AttemptAnswer } from 'src/modules/attempt-answer/entities/attempt-answer.entity';
import { Question } from 'src/modules/question/entities/question.entity';

@Table({ 
    tableName: 'answers', timestamps: true ,
    indexes: [
        {
            fields: ['questionId'],
        },
    ]
})
export class Answer extends Model {
    @Column({ primaryKey: true, autoIncrement: true })
    id: number;

    @Column({ type: DataType.STRING, allowNull: false })
    title: string;

    @Column({ type: DataType.BOOLEAN,allowNull: false })
    isCorrect: boolean;

    @ForeignKey(() => Question)
    @Column({ allowNull: false })
    @Column
    questionId: number;

    @BelongsTo(() => Question)
    question: Question;

    @HasMany(() => AttemptAnswer)
    attemptAnswers: AttemptAnswer[];
}