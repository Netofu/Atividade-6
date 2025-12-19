import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Question } from '../entities/Question';
import { Comment } from '../entities/Comment';
import { User } from '../entities/User';
import { Tag } from '../entities/Tag';

export class QuestionController {
    private questionRepository = AppDataSource.getRepository(Question);
    private commentRepository = AppDataSource.getRepository(Comment);
    private tagRepository = AppDataSource.getRepository(Tag);
    private userRepository = AppDataSource.getRepository(User);

    async getQuestionById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const question = await this.questionRepository.findOne({
                where: { id },
                relations: ['tags', 'author', 'comments']
            });

            if (!question) {
                return res.status(404).json({ error: 'Question not found' });
            }

            // Return question without correctIndex and author details
            const response = {
                id: question.id,
                statement: question.statement,
                options: question.options,
                tags: question.tags.map(tag => tag.name),
                authorName: question.author.name,
                commentsCount: question.comments.length,
                createdAt: question.createdAt
            };

            res.json(response);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch question' });
        }
    }

    async answerQuestion(req: Request, res: Response) {
        try {
            const { id, answer } = req.body;
            const question = await this.questionRepository.findOne({
                where: { id }
            });

            if (!question) {
                return res.status(404).json({ error: 'Question not found' });
            }

            const isCorrect = answer === question.correctIndex;
            res.json({
                result: isCorrect ? 'certo' : 'errado'
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to validate answer' });
        }
    }

    async addComment(req: Request, res: Response) {
        try {
            const { questionId } = req.params;
            const { text, userId } = req.body;

            const question = await this.questionRepository.findOne({
                where: { id: questionId }
            });
            
            const user = await this.userRepository.findOne({
                where: { id: userId }
            });

            if (!question) {
                return res.status(404).json({ error: 'Question not found' });
            }
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const comment = new Comment();
            comment.text = text;
            comment.question = question;
            comment.author = user;

            const savedComment = await this.commentRepository.save(comment);
            
            res.status(201).json({
                id: savedComment.id,
                text: savedComment.text,
                author: user.name,
                createdAt: savedComment.createdAt
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to add comment' });
        }
    }

    async getQuestionComments(req: Request, res: Response) {
        try {
            const { questionId } = req.params;
            
            const comments = await this.commentRepository.find({
                where: { question: { id: questionId } },
                relations: ['author'],
                order: { createdAt: 'DESC' }
            });

            const response = comments.map(comment => ({
                id: comment.id,
                text: comment.text,
                author: comment.author.name,
                createdAt: comment.createdAt
            }));

            res.json(response);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch comments' });
        }
    }

    async getQuestionsByTag(req: Request, res: Response) {
        try {
            const { tagName } = req.params;
            
            const tag = await this.tagRepository.findOne({
                where: { name: tagName },
                relations: ['questions', 'questions.author', 'questions.tags']
            });

            if (!tag) {
                return res.status(404).json({ error: 'Tag not found' });
            }

            const response = tag.questions.map(question => ({
                id: question.id,
                statement: question.statement,
                author: question.author.name,
                tags: question.tags.map(t => t.name),
                commentsCount: question.comments ? question.comments.length : 0,
                createdAt: question.createdAt
            }));

            res.json(response);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch questions by tag' });
        }
    }
}
