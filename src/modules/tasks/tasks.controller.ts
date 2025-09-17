import { Controller , Post , Get , Patch , Delete, Body, Param } from "@nestjs/common";
import { CreateTaskDto } from "src/shared/dtos/create-task.dto";
import { UpdateTaskDto } from "src/shared/dtos/update-task.dto";
import { TaskService } from "./tasks.service";

@Controller('tasks')
export class TaskController{
    constructor(private readonly taskService : TaskService){}

    @Post()
    createTask(@Body() body : CreateTaskDto){
        return this.taskService.createTask(body);
    }

    @Get(':id')
    getTask(@Param('id') id : string){
        return this.taskService.getTask(id);
    }

    @Patch(':id')
    updateTask(@Param('id') id : string , @Body() body : UpdateTaskDto){
        return this.taskService.updateTask(id , body);
    }

    @Delete(':id')
    deleteTask(@Param('id') id : string){
        return this.taskService.deleteTask(id);
    }

    @Post(':id/comments')
    addComment(@Param('id') id : string , @Body() comment : string){
        return this.taskService.addComment(id , comment);
    }

    @Get(':id/comments')
    getComments(@Param('id') id : string){
        return this.taskService.getComments(id);
    }

}