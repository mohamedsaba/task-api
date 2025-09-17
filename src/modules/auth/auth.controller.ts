import { Body, Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from "@nestjs/common";
import { AuthServices } from "./auth.service";
import { CreateUserDto } from "src/shared/dtos/create-user.dto";
import { LoginDto } from "src/shared/dtos/login.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller('auth')
export class AuthController{
    constructor(private readonly authServices : AuthServices){}

    @Post('register')
    register(@Body() body : CreateUserDto){
        return this.authServices.register(body);
    }

    @Post('login')
    login(@Body() body : LoginDto){
        return this.authServices.login(body);
    }

    @Post('refresh')
    // @UseGuards(AuthGuard('jwt'))
    refresh(@Request() req : any){
        const token = req.headers.authorization.split(' ')[1];
        return this.authServices.refresh(token);
    }

    @Post('logout')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.OK)
    logout(@Request() req : any){
        const token = req.headers.authorization.split(' ')[1];
        return this.authServices.logout(token);
    }
}