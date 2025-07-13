import { Expose, Type } from 'class-transformer';
import { AttemptAnswerItemDto } from './attempt-answer-item.dto';

export class AttemptWithAnswersDto {
    @Expose()
    id: number;

    @Expose()
    status: string;

    @Expose()
    @Type(() => AttemptAnswerItemDto)
    attemptAnswers: AttemptAnswerItemDto[];
}