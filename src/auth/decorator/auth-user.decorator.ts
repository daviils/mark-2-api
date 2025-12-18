import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import {GqlExecutionContext} from '@nestjs/graphql';

export const AuthUser = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req.user;
    },
);

export const AuthUserRest = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
