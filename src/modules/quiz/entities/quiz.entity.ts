import {Table,Column,Model,DataType,ForeignKey,BelongsTo,HasMany} from 'sequelize-typescript';
import { Attempt } from 'src/modules/attempt/entities/attempt.entity';
import { Level } from 'src/modules/level/entities/level.entity';
import { Question } from 'src/modules/question/entities/question.entity';
import { QuizProgress } from 'src/modules/quiz-progress/entities/quiz-progress.entity';

@Table({ tableName: 'quizzes', timestamps: true })
export class Quiz extends Model {
    @Column({ primaryKey: true, autoIncrement: true })
    id: number;

    @Column({ type: DataType.STRING, allowNull: false })
    title: string;

    @Column({ type: DataType.STRING })
    headline: string;

    @ForeignKey(() => Level)
    @Column({ allowNull: false })
    levelId: number;

    @BelongsTo(() => Level)
    level: Level;

    @Column({ type: DataType.INTEGER })
    numberOfQuestions: number;

    @Column({ type: DataType.INTEGER })
    passScore: number;

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false }) 
    isPublished: boolean;

    @HasMany(() => Question)
    questions: Question[];

    @HasMany(() => QuizProgress)
    quizProgresses: QuizProgress[];

    @HasMany(() => Attempt)
    attempts: Attempt[];
} 