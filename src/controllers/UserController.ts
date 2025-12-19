import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { Profile } from '../entities/Profile';

export class UserController {
    private userRepository = AppDataSource.getRepository(User);

    async createUser(req: Request, res: Response) {
        try {
            const { name, email, bio } = req.body;
            
            const existingUser = await this.userRepository.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ error: 'Email already exists' });
            }

            const user = new User();
            user.name = name;
            user.email = email;
            
            // Create profile along with user
            const profile = new Profile();
            profile.bio = bio || '';
            user.profile = profile;

            const savedUser = await this.userRepository.save(user);
            
            // Remove profile from response to avoid circular reference
            const { profile: _, ...userResponse } = savedUser;
            
            res.status(201).json(userResponse);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create user' });
        }
    }

    async createUserQuestion(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const { statement, options, correctIndex, tags } = req.body;

            const userRepository = AppDataSource.getRepository(User);
            const questionRepository = AppDataSource.getRepository(Question);
            const tagRepository = AppDataSource.getRepository(Tag);

            const user = await userRepository.findOne({ where: { id: userId } });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const question = new Question();
            question.statement = statement;
            question.options = options;
            question.correctIndex = correctIndex;
            question.author = user;

            // Handle tags
            if (tags && tags.length > 0) {
                const tagEntities: Tag[] = [];
                for (const tagName of tags) {
                    let tag = await tagRepository.findOne({ where: { name: tagName } });
                    if (!tag) {
                        tag = new Tag();
                        tag.name = tagName;
                        tag = await tagRepository.save(tag);
                    }
                    tagEntities.push(tag);
                }
                question.tags = tagEntities;
            }

            const savedQuestion = await questionRepository.save(question);
            
            // Remove correctIndex from response
            const { correctIndex: _, ...questionResponse } = savedQuestion;
            
            res.status(201).json(questionResponse);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create question' });
        }
    }
}
