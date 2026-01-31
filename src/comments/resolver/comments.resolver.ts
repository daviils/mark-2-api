import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CommentsService } from '../service/comments.service';
import { CreateCommentsInput, ReportCommentsInput } from '../dto/create-comments.input';
import { DefaultMessage } from 'src/common/default-message';

@Resolver()
export class CommentsResolver {

    constructor(
        private service: CommentsService,
    ) { }

    @Mutation(() => DefaultMessage)
    async createComments(@Args('input', { type: () => CreateCommentsInput }) input: CreateCommentsInput) {
        return this.service.create(input);
    }

    @Mutation(() => DefaultMessage)
    async reportTopic(@Args('input', { type: () => ReportCommentsInput }) input: ReportCommentsInput) {
        return this.service.report(input);
    }
}
