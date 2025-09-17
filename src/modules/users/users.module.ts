import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersServices } from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/database/entities/user.entity";

@Module({
    imports : [ TypeOrmModule.forFeature([UserEntity]),],
    controllers : [UsersController],
    providers : [UsersServices],
    exports : [UsersServices]
})
export class UsersModule{}