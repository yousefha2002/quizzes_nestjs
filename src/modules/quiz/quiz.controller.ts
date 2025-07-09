import { Body, Controller, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { QuizListDto } from './dto/quiz-list.dto';
import { Serilaize } from 'src/common/interceptors/serialize.interceptor';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}
  
  @UseGuards(AdminGuard)
  @Post('create')
  createQuiz(@Body() dto: CreateQuizDto) {
    return this.quizService.create(dto);
  }

  @UseGuards(AdminGuard)
  @Put('update/:id')
  updateQuiz(@Param('id') id: string, @Body() dto: UpdateQuizDto) {
    return this.quizService.update(+id, dto);
  }

  @UseGuards(AdminGuard)
  @Patch('publish/:id')
  async publishQuiz(@Param('id') id: string) {
    return this.quizService.publish(+id);
  }

  @UseGuards(AdminGuard)
  @Patch('freeze/:id')
  freezeQuiz(@Param('id') id: string) {
    return this.quizService.toggleFreeze(+id, true);
  }

  @UseGuards(AdminGuard)
  @Patch('unfreeze/:id')
  unfreezeQuiz(@Param('id') id: string) {
    return this.quizService.toggleFreeze(+id, false);
  }

  @Get('byLevel/:categoryTitle/:levelTitle')
  @Serilaize(QuizListDto)
  getByLevelAndCategory(@Param('categoryTitle') categoryTitle: string,@Param('levelTitle') levelTitle: string) {
    return this.quizService.findAllByLevelAndCategory(levelTitle.toLowerCase(), categoryTitle.toLowerCase());
  }
}
