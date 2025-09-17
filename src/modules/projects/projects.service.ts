import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateProjectDto } from '../../shared/dtos/create-project.dto';
import { ProjectEntity } from "src/database/entities/project.entity";
import { UpdateProjectDto } from "src/shared/dtos/update-project.dto";
import { UsersServices } from '../users/users.service';
import { CreateUserDto } from "src/shared/dtos/create-user.dto";

@Injectable()
export class ProjectService{
    constructor(@InjectRepository(ProjectEntity) private projectRepository : Repository<ProjectEntity> ,
                private readonly usersServices : UsersServices){}

    async createProject(body : CreateProjectDto){
        return await this.projectRepository.save(body);
    }

    async getProjects() : Promise<ProjectEntity[]>{
        return await this.projectRepository.find({ relations : []});
    }

    async getProject(id : string) : Promise<ProjectEntity>{

        const project =  await this.projectRepository.findOne({where : {id}});

        if(!project) throw new NotFoundException('Project With This Id Does not exist')

        return project;
    }

    async updateProject(id : string , body : UpdateProjectDto){
        const project = await this.getProject(id);
        const updatedProject = Object.assign(project , body);
        return this.projectRepository.save(updatedProject);
    }

    async

    async deleteProject(id : string){
        return await this.projectRepository.delete(id);
    }

    async addMember(projectId: string, body: CreateUserDto) {

        const member = await this.usersServices.getUserByEmail(body.email);
        
        if (!member) throw new NotFoundException('There is no user with this email.');

        const project = await this.getProject(projectId);
        
        // Check if the user is already a member to avoid duplicates
        const isMember = project.members.some(user => user.id === member.id);

        if (isMember) throw new BadRequestException('User is already a member of this project.');

        // Add the new member to the project's members array
        project.members.push(member);

        // Save the updated project to the database
        await this.projectRepository.save(project);

        return {message : `Member with id : ${member.id} has been Added successfully`};    
    }

    async deleteMember(projectId : string , userId : string){

        const project = await this.getProject(projectId);

        const user = await this.usersServices.getUserById(userId);

        if(!user) throw new NotFoundException('There is no user with such id');

        const isMember = project.members.some(member => member.id === userId);

        if(!isMember) throw new NotFoundException('There is no such member with this id');

        const memberIndex = project.members.findIndex(user => user.id === userId);

        project.members.splice(memberIndex , 1);

        await this.projectRepository.save(project);

        return {message : `Member with id : ${userId} has been deleted successfully`};
    }

    async getTasks(projectId: string) {
        const project = await this.projectRepository
            .createQueryBuilder('project')
            .leftJoinAndSelect('project.tasks', 'task')
            .where('project.id = :id', { id: projectId })
            .getOne();

        if (!project) {
            throw new NotFoundException('Project not found.');
        }

        return project.tasks;
    }
}