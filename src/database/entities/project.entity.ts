import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { UserEntity } from "./user.entity";
import { TaskEntity } from "./task.entity";


@Entity()
export class ProjectEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @ManyToMany(() => UserEntity, user => user.projects, { eager: true })
    @JoinTable()
    members: UserEntity[];
    
    @OneToMany(() => TaskEntity, task => task.project, { cascade: true })
    tasks: TaskEntity[];
}
