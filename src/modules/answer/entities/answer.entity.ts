import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Question } from 'src/modules/question/entities/question.entity';

@Table({ tableName: 'answers', timestamps: true })
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
}