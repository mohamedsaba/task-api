import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './database/entities/user.entity';
import { ProjectEntity } from './database/entities/project.entity';
import { TaskEntity } from './database/entities/task.entity';
import { ProjectsModule } from './modules/projects/projects.module';
import { TaskModule } from './modules/tasks/tasks.module';


@Module({
  imports: [AuthModule , UsersModule , ProjectsModule , TaskModule , 
    TypeOrmModule.forRoot({
      type : 'mysql' , 
      host : 'localhost' , 
      port : 3306 , 
      username : 'root' , 
      password : '' ,
      database : 'TaskApi' , 
      entities : [UserEntity , ProjectEntity , TaskEntity] ,
      synchronize : false
  })],
})
export class AppModule {}
