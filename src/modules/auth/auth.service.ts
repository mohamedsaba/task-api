/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { CreateUserDto } from "src/shared/dtos/create-user.dto";
import { JwtPayload } from "./jwt.strategy";
import { JwtService } from "@nestjs/jwt";
import { UsersServices } from "../users/users.service";
import * as bcrypt from 'bcrypt'
import { LoginDto } from "src/shared/dtos/login.dto";
import { RevokedTokenService } from "./revokedTokens.service";
import { UserEntity } from "src/database/entities/user.entity";

@Injectable()
export class AuthServices{
    constructor(
        private readonly jwtService : JwtService ,
        private readonly userServices : UsersServices , 
        private readonly revokedTokenService : RevokedTokenService){}

    private async tokenGenerator(payload : JwtPayload){
        return await this.jwtService.signAsync(payload)
    }
     // This method is for Passport strategies to validate user credentials.
    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.userServices.getUserByEmail(email);

        if (user && (await bcrypt.compare(pass, (user).password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    // Handles user registration.
    // src/modules/auth/auth.service.ts
// ...
async register(body: CreateUserDto) {
    const { v4: uuid } = await import('uuid');
    const isFound = await this.userServices.getUserByEmail(body.email);

    if (isFound) {
        throw new BadRequestException('This email is already taken.');
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    
    // Create the user object from the DTO and add the hashed password
    const userToSave = { ...body, password: hashedPassword };

    // Await the addUser call and capture the new user with the generated ID
    const newUser = await this.userServices.addUser(userToSave as UserEntity);

    // Use the newly created user object (newUser) for the payload
    const payload: JwtPayload = { sub: newUser.id || '', jti : uuid()};
    const token = await this.tokenGenerator(payload);

    // Return the user and the newly generated token.
    // Make sure to return the newUser object, not the original 'user'
    return { user: newUser, token };
}

    async login({email , password} : LoginDto){
        const { v4: uuid } = await import('uuid');
        const user = await this.userServices.getUserByEmail(email);

        if (!user) {
            // Use a specific HTTP exception for a better response.
            throw new NotFoundException('There is no user with this email.');
        }

        if (!(await bcrypt.compare(password, user.password))) {
            // Use a specific HTTP exception for a better response.
            throw new UnauthorizedException('Wrong password');
        }

        const payload: JwtPayload = { sub :  user.id || '' , jti : uuid()};
        const token = await this.tokenGenerator(payload);

        return {user , token}
    }

    async refresh(token: string) {
        const { v4: uuid } = await import('uuid');
        try {
            const payload: JwtPayload = await this.jwtService.verifyAsync(token, { ignoreExpiration: true });

            // Check for token revocation after verification
            if (this.revokedTokenService.isTokenRevoked(payload.jti)) {
                throw new UnauthorizedException('Token has been revoked');
            }

            // The rest of your logic...
            const user = await this.userServices.getUserById(payload.sub);
            if (!user) throw new UnauthorizedException('User Not Found');

            const newPayload: JwtPayload = { sub: user.id || '', jti: uuid() };
            const newToken = await this.jwtService.signAsync(newPayload);

            return { token: newToken };
        } catch (err) {
            if (err instanceof UnauthorizedException) {
                throw err; // Re-throw the specific revocation error
            }
            // Catch all other errors (e.g., token expired, invalid signature, missing claims)
            throw new UnauthorizedException('Invalid or Expired Token');
        }
    }
    async logout(token: string) {
        try {
            const payload: JwtPayload = await this.jwtService.verifyAsync(token);

            if (payload && payload.jti) {
                this.revokedTokenService.revokeToken(payload.jti);
            }
            
            return { message: 'Successfully logged out.' };
        } catch (error) {
            // We return a success message regardless of the token's validity for security reasons.
            // This prevents a malicious actor from discovering if a token is valid through the response.
            return { message: 'Successfully logged out.' };
        }
    }
}