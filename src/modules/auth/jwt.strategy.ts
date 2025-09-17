import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UsersServices } from "../users/users.service";
import { RevokedTokenService } from "./revokedTokens.service";

export interface JwtPayload {
    sub : string , 
    jti : string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    // Inject both the UsersServices and the new RevokedTokenService.
    constructor(
        private readonly userServices : UsersServices,
        private readonly revokedTokenService: RevokedTokenService
    ){
     super({
        jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration : false , 
        secretOrKey : 'THIS_IS_A_SECRET'
     })
    }

    async validate(payload: JwtPayload) {
        // First, check if the token has been explicitly revoked (blacklisted).
        const isRevoked =  this.revokedTokenService.isTokenRevoked(payload.jti);
        if (isRevoked) {
            throw new UnauthorizedException('Token has been revoked.');
        }

        // Second, check if the user of this token exists.
        const user = await this.userServices.getUserById(payload.sub);
        
        // If the user doesn't exist, throw an error.
        if (!user) {
            throw new UnauthorizedException('User not found.');
        }

        // Return the user object (or a subset of it) which will be attached to the request.
        return { userId: user.id };
    }
}
