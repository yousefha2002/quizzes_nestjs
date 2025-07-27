import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Level } from 'src/modules/level/entities/level.entity';
import { User } from 'src/modules/user/entities/user.entity';

@Table({ tableName: 'level_progresses', timestamps: true,
        indexes:[{fields: ['userId', 'levelId']}]
    })
export class LevelProgress extends Model {
    @Column({ primaryKey: true, autoIncrement: true })
    id: number;

    @ForeignKey(() => User)
    @Column({ allowNull: false })
    @Column
    userId: number;

    @ForeignKey(() => Level)
    @Column({ allowNull: false })
    @Column
    levelId: number;

    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
    completedQuizzes: number;

    @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
    lastUpdate: Date

    @BelongsTo(() => User)
    user: User;

    @BelongsTo(() => Level)
    level: Level;
}