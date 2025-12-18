import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import dayjs from '../common/dayjs.config';

@Injectable()
export class DateTimezoneInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                return this.convertDatesToTimezone(data);
            }),
        );
    }

    private convertDatesToTimezone(obj: any): any {
        if (Array.isArray(obj)) {
            return obj.map((item) => this.convertDatesToTimezone(item));
        } else if (obj && typeof obj === 'object') {
            const result: any = {};
            for (const key of Object.keys(obj)) {
                const value = obj[key];
                if (value instanceof Date) {
                    result[key] = dayjs(value).tz().toDate();
                } else {
                    result[key] = this.convertDatesToTimezone(value);
                }
            }
            return result;
        }
        return obj;
    }
}
