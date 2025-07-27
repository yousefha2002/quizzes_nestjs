import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Level } from 'src/modules/level/entities/level.entity';
import { User } from 'src/modules/user/entities/user.entity';

@Table({ tableName: 'certificates', timestamps: true ,
    indexes: [
        { fields: ['userId'] },              
        { fields: ['userId', 'levelId'] },   
        { fields: ['userId', 'id'] },  
    ]
})
export class Certificate extends Model {
    @Column({ primaryKey: true, autoIncrement: true })
    id: number;

    @ForeignKey(() => User)
    @Column
    userId: number;

    @ForeignKey(() => Level)
    @Column({ allowNull: false })
    levelId: number;

    @Column({ type: DataType.DATE,allowNull:false})
    obtainedAt: Date;

    @BelongsTo(() => User)
    user: User;

    @BelongsTo(() => Level)
    level: Level;
}