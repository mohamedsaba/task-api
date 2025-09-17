import { Controller, Get, Param, Patch } from "@nestjs/common";
import { UsersServices } from "./users.service";

@Controller('users')
export class UsersController{
    constructor(private readonly usersServices : UsersServices){}

    @Get('me')
    getMyProfile(){
        return this.usersServices.getMyProfile();
    }

    @Patch('me')
    updateMyProfile(){
        return this.usersServices.updateMyProfile();
    }


    @Patch('me/password')
    changePassword(){
        return this.usersServices.changePassword();
    }

    @Get(':id')
    getUserById(@Param('id') id : string){
        return this.usersServices.getUserById(id);
    }

    @Get() // ====> For Admin Only
    getAllUsers(){
        return this.usersServices.getAllUsers();
    }
}