import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Profile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', { nullable: true })
    bio: string;

    @Column({ nullable: true })
    photoUrl: string;

    @OneToOne(() => User, (user) => user.profile)
    @JoinColumn()
    user: User;
}
