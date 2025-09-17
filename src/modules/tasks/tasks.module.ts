import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TaskEntity } from "src/database/entities/task.entity";
import { TaskController } from "./tasks.controller";
import { TaskService } from "./tasks.service";

@Module({
    imports : [TypeOrmModule.forFeature([TaskEntity])],
    controllers : [TaskController],
    providers : [TaskService]
})
export class TaskModule{}