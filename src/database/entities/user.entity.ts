import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProjectEntity } from "./project.entity";
import { TaskEntity } from "./task.entity";

@Entity()
export class UserEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ default: 'user' })
    role: string;

    @ManyToMany(() => ProjectEntity, project => project.members)
    projects: ProjectEntity[];

    @ManyToOne(() => TaskEntity, task => task.assignedTo)
    task: TaskEntity;
}