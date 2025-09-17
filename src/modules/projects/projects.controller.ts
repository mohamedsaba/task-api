import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ProjectService } from "./projects.service";
import { UpdateProjectDto } from "src/shared/dtos/update-project.dto";
import { CreateProjectDto } from "src/shared/dtos/create-project.dto";
import { CreateUserDto } from "src/shared/dtos/create-user.dto";

@Controller('projects')
export class ProjectsController{
    constructor(private readonly projectService : ProjectService){}

    @Post()
    createProject(@Body() body : CreateProjectDto){
        return this.projectService.createProject(body);
    }

    @Get()
    getProjects(){
        return this.projectService.getProjects();
    }

    @Get(':id')
    getProject(@Param('id') id : string){
        return this.projectService.getProject(id);
    }

    @Patch(':id')
    updateProject(@Param('id') id : string , @Body() body : UpdateProjectDto){
        return this.projectService.updateProject(id , body);
    }

    @Delete(':id')
    deleteProduct(@Param('id') id : string){
        return this.projectService.deleteProject(id);
    }

    @Post(':id/members')
    addMember(@Param('id') id : string , @Body() body : CreateUserDto){
        return this.projectService.addMember(id , body);
    }

    @Delete(':id/members/:userId')
    deleteMember(@Param('id') id : string , @Param('userID') userID : string){
        return this.projectService.deleteMember(id , userID);
    }

    @Get(':id/tasks')
    getTasks(@Param('id') id : string){
        return this.projectService.getTasks(id);
    }
}