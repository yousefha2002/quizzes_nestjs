import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Category } from 'src/modules/category/entities/category.entity';
import { Certificate } from 'src/modules/certificate/entities/certificate.entity';
import { LevelProgress } from 'src/modules/level-progress/entities/level-progress.entity';
import { Quiz } from 'src/modules/quiz/entities/quiz.entity';

@Table({ tableName: 'levels', timestamps: true })
export class Level extends Model {
    @Column({ primaryKey: true, autoIncrement: true })
    id: number;

    @Column({ type: DataType.STRING, allowNull: false })
    title: string;

    @ForeignKey(() => Category)
    @Column({ allowNull: false })
    @Column
    categoryId: number;

    @BelongsTo(() => Category)
    category: Category;

    @Column({ type: DataType.BOOLEAN, allowNull: false,defaultValue:false })
    isPublished: boolean;

    @Column({ type: DataType.DATE, allowNull: false })
    lastUpdate: Date;

    @HasMany(() => Quiz)
    quizzes: Quiz[];

    @HasMany(() => Certificate)
    certificates: Certificate[];

    @HasMany(() => LevelProgress)
    levelProgresses: LevelProgress[];
}