import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateAnswerDto } from 'src/modules/answer/dto/update-answer.dto';

export class UpdateQuestionDto {
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    title?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateAnswerDto)
    @IsOptional()
    answers?: UpdateAnswerDto[];
}
