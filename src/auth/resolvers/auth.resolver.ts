import {Args, Mutation, Resolver} from '@nestjs/graphql';
import { AuthTypeAdmin} from '../dto/auth.type';
import {AuthService} from '../service/auth.service';
import {AuthInputCustomer, AuthInputAdmin} from "../dto/auth.input";

@Resolver()
export class AuthResolver {
    constructor(private authService: AuthService) {
    }

    // @Mutation(() => AuthType)
    // public async loginCustomer(
    //     @Args('data') data: AuthInputCustomer,
    // ): Promise<AuthType> {
    //     const response = await this.authService.validateUserCustomer(data);
    //     return {
    //         user: response.user,
    //         token: response.token
    //     }
    // }

    @Mutation(() => AuthTypeAdmin)
    public async loginAdmin(
        @Args('data') data: AuthInputAdmin,
    ): Promise<AuthTypeAdmin> {
        const response = await this.authService.validateUserAdmin(data);
        return {
            user: response.user,
            token: response.token
        }
    }
}
