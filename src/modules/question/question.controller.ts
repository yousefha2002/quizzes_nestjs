import { Body, Controller, Delete, Param, Post, Put, UseGuards } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionsForQuizDto } from './dto/create-question.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @UseGuards(AdminGuard)
  @Post('create')
  createQuestion(@Body() dto: CreateQuestionsForQuizDto) {
    return this.questionService.createMany(dto);
  }

  @UseGuards(AdminGuard)
  @Put('update/:id')
  updatQuestion(@Param('id') id: string, @Body() dto: UpdateQuestionDto) {
    return this.questionService.update(+id, dto);
  }

  @UseGuards(AdminGuard)
  @Delete('delete/:id')
  async softDelete(@Param('id') id: string) {
    return this.questionService.softDelete(+id);
  }
}
