import { IsArray, IsOptional, IsString , IsUUID } from "class-validator";
import { ProjectEntity } from "src/database/entities/project.entity";
import { UserEntity } from "src/database/entities/user.entity";

export class CreateTaskDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsString()
    status: string;

    @IsString()
    dueDate: string;

    @IsArray()
    @IsOptional()
    @IsString()
    comments: string[]; 

    @IsUUID() 
    project: ProjectEntity; 

    @IsArray()
    @IsUUID('4', { each: true }) 
    assignedTo: UserEntity[]; 
}