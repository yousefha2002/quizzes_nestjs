import {Injectable,NestInterceptor,ExecutionContext,CallHandler,} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';

@Injectable()
export class UserInterceptor implements NestInterceptor {
    constructor(private userService: UserService) {}
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const { userId } = request.currentUser || {};
    
        if (userId) {
            const user = await this.userService.findById(userId);
            request.currentUser = user || null;
        } else {
            request.currentUser = null;
        }
    
        return next.handle();
    }
}  