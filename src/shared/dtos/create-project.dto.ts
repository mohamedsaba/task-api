import { IsArray, IsOptional, IsString, IsUUID } from "class-validator";
import { TaskEntity } from "src/database/entities/task.entity";
import { UserEntity } from "src/database/entities/user.entity";

export class CreateProjectDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsArray()
    @IsUUID('4', { each: true }) 
    @IsOptional()
    members?: UserEntity[];

    @IsArray()
    @IsUUID('4', { each: true }) 
    @IsOptional()
    tasks?: TaskEntity[];
}
