import { Param, Controller, Post, UseGuards, Get, Patch, Body } from '@nestjs/common';
import { AttemptService } from './attempt.service';
import { UserGuard } from 'src/common/guards/user.guard';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { User } from '../user/entities/user.entity';
import { Serilaize } from 'src/common/interceptors/serialize.interceptor';
import { AttemptWithAnswersDto } from './dto/attempt-with-answers.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';

@Controller('attempt')
export class AttemptController {
  constructor(private readonly attemptService: AttemptService) {}

  @Serilaize(AttemptWithAnswersDto)
  @UseGuards(UserGuard)
  @Get('start/:quizId')
  async startAttempt(@Param('quizId') quizId:number,@CurrentUser() user:User)
  {
    return this.attemptService.startAttempt(user.id,quizId)
  }

  @UseGuards(UserGuard)
  @Patch('answer')
  async updateAnswer(@Body() dto: UpdateAnswerDto, @CurrentUser() user:User) {

    return this.attemptService.updateAttemptAnswer(
      user.id,
      dto.attemptId,
      dto.questionId,
      dto.answerId,
    );
  }
}
