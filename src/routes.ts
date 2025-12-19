import { Router } from 'express';
import { UserController } from './controllers/UserController';
import { QuestionController } from './controllers/QuestionController';

const router = Router();
const userController = new UserController();
const questionController = new QuestionController();

// User routes
router.post('/users', (req, res) => userController.createUser(req, res));
router.post('/users/:userId/questions', (req, res) => userController.createUserQuestion(req, res));

// Question routes
router.get('/questions/:id', (req, res) => questionController.getQuestionById(req, res));
router.post('/questions/answer', (req, res) => questionController.answerQuestion(req, res));
router.post('/questions/:questionId/comments', (req, res) => questionController.addComment(req, res));
router.get('/questions/:questionId/comments', (req, res) => questionController.getQuestionComments(req, res));
router.get('/tags/:tagName/questions', (req, res) => questionController.getQuestionsByTag(req, res));

export default router;
