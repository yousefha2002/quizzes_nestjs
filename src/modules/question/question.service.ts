import { QuizService } from './../quiz/quiz.service';
import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionsForQuizDto } from './dto/create-question.dto';
import { AnswerService } from '../answer/answer.service';
import { repositories } from 'src/common/enums/repositories';
import { Question } from './entities/question.entity';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Answer } from '../answer/entities/answer.entity';
import { Sequelize } from 'sequelize';

@Injectable()
export class QuestionService {
    constructor(
        @Inject(repositories.question_repository)
        private questionModel: typeof Question,
        private readonly answerService: AnswerService,

        @Inject(forwardRef(() => QuizService))
        private quizService:QuizService
    ) {}

    async createMany(dto: CreateQuestionsForQuizDto) 
    {
        const quiz = await this.quizService.findById(dto.quizId);
        if (!quiz) throw new BadRequestException(`Quiz not found`);

        for (const questionDto of dto.questions) {
            if (questionDto.answers.length < 2) {
                throw new BadRequestException('At least 2 answers are required.');
            }

            const hasCorrect = questionDto.answers.some((ans) => ans.isCorrect);
            if (!hasCorrect) {
                throw new BadRequestException('At least one answer must be correct.');
            }

            const question = await this.questionModel.create({
                title: questionDto.title,
                quizId: dto.quizId,
            });
            await this.answerService.createMany(question.id, questionDto.answers);
        }
        return { message: 'Questions created successfully' };
    }

    async update(id: number, dto: UpdateQuestionDto) {
        // 1. find question 
        const question = await this.questionModel.findByPk(id);
        if (!question) {
            throw new NotFoundException('Question not found');
        }
        // get quiz with attempts
        const quiz = await this.quizService.findById(question.quizId);
        if (!quiz) {
            throw new BadRequestException('Quiz not found');
        }
        const hasAttempts = quiz.attempts && quiz.attempts.length > 0;
        // if there is an attempt u can't change the answers
        if (hasAttempts) {
            // change the title
            if (dto.answers && dto.answers.length > 0) {
            throw new BadRequestException('Cannot modify answers of a quiz with attempts');
            }
            if (dto.title) {
            question.title = dto.title;
            await question.save();
            }
            return { message: 'Question title updated successfully. Answers cannot be changed because quiz has attempts.' };
        }
        // no attempts so can change answer
        if (dto.title) {
            question.title = dto.title;
        }
        await question.save();
        if (dto.answers && dto.answers.length > 0) {
            // delete all old answers
            await this.answerService.deleteByQuestionId(question.id);

            // check should be at least one right answer
            const hasCorrect = dto.answers.some(ans => ans.isCorrect);
            if (!hasCorrect) {
            throw new BadRequestException('At least one answer must be correct.');
            }

            // create new answers
            await this.answerService.createMany(question.id, dto.answers);
        }
        return { message: 'Question updated successfully' };
    }

    async getRandomQuestionsForQuiz(quizId: number, limit: number) 
    {
        return await this.questionModel.findAll({
            where: {
                quizId,
                deletedAt: null,
            },
            include: [{model:Answer}],
            order: [Sequelize.literal('RAND()')],
            limit,
        });
    }

    async softDelete(id: number) {
        const question = await this.questionModel.findByPk(id);
        if (!question) {
            throw new NotFoundException('Question not found');
        }
        const quiz = await this.quizService.findById(question.quizId);
        if (!quiz) {
            throw new BadRequestException('Quiz not found');
        }
        if (quiz.isPublished) {
            const activeQuestionsCount = await this.questionModel.count({
                where: {
                quizId: quiz.id,
                deletedAt: null
            },
            });

            const remainingQuestions = activeQuestionsCount - 1;
            if (remainingQuestions < quiz.numberOfQuestions) {
                throw new BadRequestException(
                    `Cannot delete this question. Quiz requires at least ${quiz.numberOfQuestions} questions, only ${activeQuestionsCount} available.`,
                );
            }
        }
        await question.destroy();
        return { message: 'Question deleted successfully' };
    }
}