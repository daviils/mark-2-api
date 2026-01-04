import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserAdmin } from '../entity/user-admin.entity';
import { DefaultMessage } from 'src/common/default-message';
import { CreateUserAdminInput } from '../dto/create-user-admin.input';
import { UserAdminService } from '../service/user-admin.service';
import { GqlAuthGuardAdmin } from 'src/auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class UserAdminResolver {
    constructor(
        private service: UserAdminService,
    ) { }

    @UseGuards(GqlAuthGuardAdmin)
    @Mutation(() => DefaultMessage)
    async createUserAdmin(@Args('input', { type: () => CreateUserAdminInput }) input: CreateUserAdminInput) {
        return this.service.create(input);
    }

    @UseGuards(GqlAuthGuardAdmin)
    @Query(() => UserAdmin)
    async byIdUserAdmin(@Args('id', { type: () => String }) id: string) {
        return this.service.findOne(id);
    }

    @UseGuards(GqlAuthGuardAdmin)
    @Query(() => [UserAdmin])
    async listUserAdmin() {
        return this.service.list();
    }
}
