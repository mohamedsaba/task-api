import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TaskEntity } from "src/database/entities/task.entity";
import { CreateTaskDto } from "src/shared/dtos/create-task.dto";
import { UpdateTaskDto } from "src/shared/dtos/update-task.dto";
import { Repository } from "typeorm";

@Injectable()
export class TaskService{
    constructor(@InjectRepository(TaskEntity) private Task : Repository<TaskEntity>){}

    async createTask(body : CreateTaskDto){
        await this.Task.save(body);
        return {message : 'Task Has Been Added Successfully'};
    }

    async getTask(id : string){
        const task = await this.Task.findOne({where : {id}})
        if(!task) throw new NotFoundException('There is no Task With Such Id');
        return task;
    }

    async updateTask(id : string , body : UpdateTaskDto){
        const task = await this.getTask(id);
        const updatedTask = Object.assign(task , body);
        return this.Task.save(updatedTask);
    }

    async deleteTask(id : string){
        await this.Task.delete(id);
        return {message : `Task : ${id} has been deleted successfully`};
    }

    async addComment(id : string , comment : string){
        let task = await this.getTask(id);
        task.comments.push(comment);
        await this.Task.save(task);
        return {message : 'Comment Has Been Added Successfully'};
    }

    async getComments(id : string){
        const task = await this.getTask(id);
        return {comments : task.comments , task : task.title};
    }
}