import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserAdmin } from '../entity/user-admin.entity';
import { DefaultMessage } from 'src/common/default-message';
import { CreateUserAdminInput } from '../dto/create-user-admin.input';
import { UserAdminService } from '../service/user-admin.service';

@Resolver()
export class UserAdminResolver {
    constructor(
        private service: UserAdminService,
    ) { }

    @Mutation(() => DefaultMessage)
    async createUserAdmin(@Args('input', { type: () => CreateUserAdminInput }) input: CreateUserAdminInput) {
        return this.service.create(input);
    }

    @Query(() => UserAdmin)
    async byIdUserAdmin(@Args('id', { type: () => String }) id: string) {
        return this.service.findOne(id);
    }

    @Query(() => [UserAdmin])
    async listUserAdmin() {
        return this.service.list();
    }
}
