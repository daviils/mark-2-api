import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import {GqlExecutionContext} from "@nestjs/graphql";

@Injectable()
export class RolesGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const ctx = GqlExecutionContext.create(context);
        const user = ctx.getContext().req.user;
        return user.profile === 'admin';
    }
}
