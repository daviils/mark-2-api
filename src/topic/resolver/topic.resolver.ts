import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TopicService } from '../service/topic.service';
import { GqlAuthGuardAdmin } from 'src/auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { DefaultMessage } from 'src/common/default-message';
import { CreateTopicInput, DeleteTopicInput, ReportTopicInput, UpdateTopicInput } from '../dto/create-topic.input';
import { SearchTopicAdminInput, SearchTopicInput } from '../dto/search-topic.input';
import { TopicPage } from '../dto/topic-page';
import { Topic } from '../entity/topic.entity';

@Resolver()
export class TopicResolver {
    constructor(
        private service: TopicService,
    ) { }

    // WEB
    @Query(() => [TopicPage])
    async searchTopics(@Args('input', { type: () => SearchTopicInput }) input: SearchTopicInput) {
        return this.service.search(input);
    }

    @Mutation(() => DefaultMessage)
    async reportTopic(@Args('input', { type: () => ReportTopicInput }) input: ReportTopicInput) {
        return this.service.report(input);
    }

    @Mutation(() => DefaultMessage)
    async createTopic(@Args('input', { type: () => CreateTopicInput }) input: CreateTopicInput) {
        return this.service.create(input);
    }

    @Query(() => Topic)
    async byIdTopic(@Args('id', { type: () => String }) id: string) {
        return this.service.byId(id);
    }

    // ADMIN
    // @UseGuards(GqlAuthGuardAdmin)
    // @Query(() => [TopicPage])
    // async searchTopicAdmin(@Args('input', { type: () => SearchTopicAdminInput }) input: SearchTopicAdminInput) {
    //     return this.service.search(input);
    // }

    // @UseGuards(GqlAuthGuardAdmin)
    // @Mutation(() => DefaultMessage)
    // async updateTopic(@Args('input', { type: () => UpdateTopicInput }) input: UpdateTopicInput) {
    //     return this.service.update(input);
    // }

    // @UseGuards(GqlAuthGuardAdmin)
    // @Mutation(() => DefaultMessage)
    // async deleteTopic(@Args('input', { type: () => DeleteTopicInput }) input: DeleteTopicInput) {
    //     return this.service.delete(input);
    // }

}