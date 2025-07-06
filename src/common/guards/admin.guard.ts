import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = request.headers.authorization;
        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        try {
        const decoded = await this.jwtService.verifyAsync(token,{
            secret:"token"
        });
        return decoded.adminId !== undefined;
        } catch (error) {
        throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
