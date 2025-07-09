import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { QuizListDto } from './dto/quiz-list.dto';
import { Serilaize } from 'src/common/interceptors/serialize.interceptor';
import { PublicQuizDto } from './dto/public-quiz.dto';
import { QuizDto } from './dto/quiz.dto';
import { QuizQuestionsDto } from './quiz-questions.dto';

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

  @Get('byLevel/:categoryTitle/:levelTitle')
  @Serilaize(QuizListDto)
  getByLevelAndCategory(
    @Param('categoryTitle') categoryTitle: string,
    @Param('levelTitle') levelTitle: string,
  ) {
    return this.quizService.findAllByLevelAndCategory(
      levelTitle.toLowerCase(),
      categoryTitle.toLowerCase(),
    );
  }

  @UseGuards(AdminGuard)
  @Serilaize(QuizDto)
  @Get('admin/byLevel/:levelId')
  getByLevelForAdmin(@Param('levelId') levelId: string) {
    return this.quizService.findAllByLevelId(+levelId);
  }

  @Get('public/:categoryTitle/:levelTitle/:quizTitle')
  @Serilaize(PublicQuizDto)
  getPublicQuiz(
    @Param('categoryTitle') categoryTitle: string,
    @Param('levelTitle') levelTitle: string,
    @Param('quizTitle') quizTitle: string,
  ) {
    return this.quizService.getPublicQuiz(
      levelTitle.toLowerCase(),
      categoryTitle.toLowerCase(),
      quizTitle.toLowerCase(),
    );
  }

  @Get('questions/:quizTitle')
  @Serilaize(QuizQuestionsDto)
  getQuizQuestions(@Param('quizTitle') quizTitle: string) {
    return this.quizService.getQuizQuestions(quizTitle.toLowerCase());
  }

  @UseGuards(AdminGuard)
  @Serilaize(QuizDto)
  @Get('admin/:quizId')
  getQuizForAdmin(@Param('quizId') quizId: string) {
    return this.quizService.findByIdForAdmin(+quizId);
  }

  @Serilaize(QuizDto)
  @UseGuards(AdminGuard)
  @Get('/admin/:quizId/details')
  quizDetailsForAdmin(@Param('quizId') quizId: string) {
    return this.quizService.getQuizDetailsForAdmin(+quizId);
  }
}
