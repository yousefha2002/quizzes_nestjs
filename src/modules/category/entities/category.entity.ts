import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Level } from 'src/modules/level/entities/level.entity';

@Table({ tableName: 'categories', timestamps: true })
export class Category extends Model {
    @Column({ primaryKey: true, autoIncrement: true })
    id: number;

    @Column({ type: DataType.STRING, allowNull: false,unique:true })
    title: string;

    @Column({ type: DataType.BOOLEAN, allowNull: false,defaultValue: false })
    isPublished: boolean;

    @HasMany(() => Level)
    levels: Level[];
}