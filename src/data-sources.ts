import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Question } from './entities/Question';
import { Comment } from './entities/Comment';
import { Tag } from './entities/Tag';
import { Profile } from './entities/Profile';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'password',
    database: 'qanda_db',
    synchronize: true,
    logging: true,
    entities: [User, Question, Comment, Tag, Profile],
    subscribers: [],
    migrations: [],
});
