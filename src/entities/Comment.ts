import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Question } from './Question';
import { User } from './User';

@Entity()
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    text: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Question, (question) => question.comments)
    question: Question;

    @ManyToOne(() => User, (user) => user.comments)
    author: User;
}
