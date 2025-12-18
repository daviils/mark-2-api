import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserAdminService } from "../../user-admin/service/user-admin.service";
import { UserAdmin } from 'src/user-admin/entity/user-admin.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private userAdminService: UserAdminService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: { id: UserAdmin['id'], role: string, name: string }) {

        if (payload.role == 'admin') {
            const admin = await this.userAdminService.findUserByIdIntern(payload.id)
            if (!admin)
                throw new UnauthorizedException('Sua sessão expirou, efetue o login novamente.')

            return admin;
        }
    }
}
