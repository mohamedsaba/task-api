import { Module } from "@nestjs/common";
import { ProjectsController } from "./projects.controller";
import { ProjectService } from "./projects.service";
import { ProjectEntity } from "src/database/entities/project.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "../users/users.module";

@Module({
    imports : [UsersModule ,TypeOrmModule.forFeature([ProjectEntity])] ,
    controllers : [ProjectsController] , 
    providers : [ProjectService] ,
    exports : [ProjectService]
})
export class ProjectsModule{}