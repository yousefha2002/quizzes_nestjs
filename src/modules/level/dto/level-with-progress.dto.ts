import { Expose, Type } from "class-transformer";
import { LevelBaseDto } from "./level-base.dto";

export class LevelWithProgressDto extends LevelBaseDto{
    @Expose()
    completedQuizzes: number;
}