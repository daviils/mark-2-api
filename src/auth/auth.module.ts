import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { JwtStrategy } from './guards/jwt.strategy';
import { AuthService } from './service/auth.service';
import { AuthResolver } from './resolvers/auth.resolver';
import { UserAdminService } from "../user-admin/service/user-admin.service";
import { UserAdmin } from "../user-admin/entity/user-admin.entity";
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            UserAdmin,
        ]),
        JwtModule.registerAsync({
            useFactory: () => ({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '24h' },
            }),
        }),
        HttpModule,
    ],
    providers: [AuthService, AuthResolver, UserAdminService, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {
}
