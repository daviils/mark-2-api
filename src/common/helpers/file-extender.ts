
import { Observable } from "rxjs";
import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Param } from '@nestjs/common';

export class FileExtender implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        console.log(req.file);
        return next.handle();
    }
}