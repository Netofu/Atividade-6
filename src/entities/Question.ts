import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable, CreateDateColumn } from 'typeorm';
import { User } from './User';
import { Comment } from './Comment';
import { Tag } from './Tag';

@Entity()
export class Question {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    statement: string;

    @Column('simple-array')
    options: string[];

    @Column()
    correctIndex: number;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.questions)
    author: User;

    @OneToMany(() => Comment, (comment) => comment.question)
    comments: Comment[];

    @ManyToMany(() => Tag, (tag) => tag.questions, { cascade: true })
    @JoinTable()
    tags: Tag[];
}
