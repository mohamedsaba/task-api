import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { UsersModule } from "../users/users.module";
import { PassportModule } from "@nestjs/passport";
import { AuthServices } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { RevokedTokenService } from "./revokedTokens.service";

@Module({
    imports : [
        UsersModule , 
        PassportModule , 
        JwtModule.register({
            secret : 'THIS_IS_A_SECRET',
            signOptions : {expiresIn : '1h'}
        })

    ],
    controllers : [AuthController],
    providers : [AuthServices , JwtStrategy , RevokedTokenService]
})
export class AuthModule{}