import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { AuthTypeAdmin } from '../dto/auth.type';
import { AuthInputCustomer, AuthInputAdmin } from "../dto/auth.input";
import { compareSync } from "bcrypt";
import { UserAdminService } from "../../user-admin/service/user-admin.service";
import { UserAdmin } from "../../user-admin/entity/user-admin.entity";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private userAdminService: UserAdminService,
        private jwtService: JwtService,
    ) {
    }

    // async validateUserCustomer(data: AuthInputCustomer): Promise<AuthType> {
    //     const userCustomer = await this.userCustomerService.findUserCustomerByLogin(data.cpf);

    //     if (!userCustomer || userCustomer.status == 'inactive') {
    //         throw new NotFoundException('Usuário não encontrado!');
    //     }

    //     const validPassword = compareSync(data.password, userCustomer.password);
    //     if (!validPassword) {
    //         throw new BadRequestException('Email e/ou senha inválidos.');
    //     }

    //     const token = await this.jwtToken(userCustomer);

    //     return {
    //         user: userCustomer,
    //         token,
    //     };
    // }

    private async jwtToken(user: UserAdmin): Promise<string> {
        const payload = {
            name: user.name,
            role: 'customer',
            id: user.id,
        };
        return this.jwtService.signAsync(payload);
    }

    async validateUserAdmin(data: AuthInputAdmin): Promise<AuthTypeAdmin> {
        const userAdmin = await this.userAdminService.findOneByEmail(data.email);

        const validPassword = compareSync(data.password, userAdmin.password);
        if (!validPassword) {
            throw new BadRequestException('Email e/ou senha inválidos.');
        }

        const token = await this.jwtTokenAdmin(userAdmin);

        return {
            user: userAdmin,
            token,
        };
    }

    private async jwtTokenAdmin(admin: UserAdmin): Promise<string> {
        const payload = {
            name: admin.name,
            role: 'admin',
            id: admin.id,
        };
        return this.jwtService.signAsync(payload, { expiresIn: '24h' });
    }

}
