import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { UserEntity } from "src/database/entities/user.entity";
import fs from 'fs'
import path from 'path'
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from '../../shared/dtos/create-user.dto';
import { UpdateUserDto } from "src/shared/dtos/update-user.dto";
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersServices{

    constructor(@InjectRepository(UserEntity) private userRepository : Repository<UserEntity>){}

    async addUser(user : UserEntity){
        return await this.userRepository.save(user);
    }

    async getMyProfile(id : string){
        const user = await this.userRepository.findOne({where : {id}});
        if(!user) throw new NotFoundException('There is no user with such id');
        return user;
    }

    async updateMyProfile(id : string , body : UpdateUserDto){
        const user = await this.getMyProfile(id);
        const {username , email } = body;
        const isEmailFound = await this.userRepository.findOne({where : {email}});
        if(email && isEmailFound) throw new UnauthorizedException('Email is ALready in use');
        const isUsernameFound = await this.userRepository.findOne({where : {username}}); 
        if(username && isUsernameFound) throw new UnauthorizedException('username is already in use');
        const newUser = {...user , username , email};
        await this.userRepository.save(newUser);
        return {message : `User : ${user.id}'s profile has been updated successfully` , newUser}
    }

    async changePassword(id : string , password : string){
        const user = await this.getMyProfile(id);
        const hashedPassword = bcrypt.hashSync(password , 10);
        const newUser = {...user , password : hashedPassword};
        await this.userRepository.save(newUser);
        return {message : `Password Has Been Changed Successfully`}
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
