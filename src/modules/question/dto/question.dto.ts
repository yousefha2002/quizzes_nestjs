import { Expose } from "class-transformer";

export class QuestionDto {
    @Expose()
    id: number;

    @Expose()
    title: string;
}