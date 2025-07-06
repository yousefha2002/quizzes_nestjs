import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization;

        if (!token) {
            throw new UnauthorizedException('يجب عليك تسجيل الدخول');
        }

        try {
            const decodedToken = await this.jwtService.verifyAsync(token, {
                secret: 'token',
            });

            request.currentUser = decodedToken;
            return decodedToken.userId !== undefined;
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}