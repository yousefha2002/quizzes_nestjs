import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AdminService } from 'src/modules/admin/admin.service';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private adminService: AdminService, 
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = request.headers.authorization;

        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        try {
            const decoded = await this.jwtService.verifyAsync(token, {
                secret: 'token',
            });

            if (!decoded.adminId) {
                throw new UnauthorizedException('Invalid token: adminId missing');
            }

            const admin = await this.adminService.findOneById(decoded.adminId);
            if (!admin) {
                throw new UnauthorizedException('Admin not found');
            }

            request['currentAdmin'] = admin;

            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}