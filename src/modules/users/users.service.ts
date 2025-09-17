import { Injectable } from "@nestjs/common";
import { UserEntity } from "src/database/entities/user.entity";
import fs from 'fs'
import path from 'path'
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
@Injectable()
export class UsersServices{

    constructor(@InjectRepository(UserEntity) private userRepository : Repository<UserEntity>){}

    async addUser(user : UserEntity){
        const newUser = await this.userRepository.create(user);
        return await this.userRepository.save(newUser);
    }

    getMyProfile(){

    }

    updateMyProfile(){

    }

    changePassword(){

    }

    async getUserById(id : string){
        return await this.userRepository.findOne({where : {id}})
    }

    async getUserByEmail(email : string){
        return await this.userRepository.findOne({where : {email}});
    }

    async getAllUsers(){
        return await this.userRepository.find();
    }
}