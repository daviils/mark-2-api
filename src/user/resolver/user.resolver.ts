import { Args, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { User } from '../entity/user.entity';
import { UserService } from '../service/user.service';

@Resolver()
export class UserResolver {
	constructor(
		private userService: UserService,
	) { }

	@Query(() => User)
	async userById(@Args('id', { type: () => String }) id: string) {
		return this.userService.findOneById(id);
	}

	@Query(() => [User])
	async users() {
		return this.userService.findAllUser();
	}

}
