import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { Question } from './Question';
import { Comment } from './Comment';
import { Profile } from './Profile';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @OneToMany(() => Question, (question) => question.author)
    questions: Question[];

    @OneToMany(() => Comment, (comment) => comment.author)
    comments: Comment[];

    @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
    profile: Profile;
}
