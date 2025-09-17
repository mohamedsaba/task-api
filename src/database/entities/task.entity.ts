import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { ProjectEntity } from './project.entity';
import { UserEntity } from './user.entity';

@Entity()
export class TaskEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column('text')
    comments: string[];

    @Column()
    status: string;

    @Column()
    dueDate: string;

    @ManyToOne(() => ProjectEntity, project => project.tasks)
    project: ProjectEntity;

    @OneToMany(() => UserEntity, user => user.task)
    assignedTo: UserEntity[];
}