import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { VideosService } from '../service/videos.service';
import { Videos } from '../entity/videos.entity';
import { CreateVideoInput, DeleteVideoInput, UpdateVideoInput } from '../dto/create-video.input';
import { DefaultMessage } from 'src/common/default-message';
import { VideoPage } from '../dto/video-page';
import { SearchVideoInput } from '../dto/search-video.input';
import { GqlAuthGuardAdmin } from 'src/auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class VideosResolver {
    constructor(
        private service: VideosService,
    ) { }

    @UseGuards(GqlAuthGuardAdmin)
    @Mutation(() => DefaultMessage)
    async createVideo(@Args('input', { type: () => CreateVideoInput }) input: CreateVideoInput) {
        return this.service.create(input);
    }
    
    @UseGuards(GqlAuthGuardAdmin)
    @Mutation(() => DefaultMessage)
    async updateVideo(@Args('input', { type: () => UpdateVideoInput }) input: UpdateVideoInput) {
        return this.service.update(input);
    }
    
    @UseGuards(GqlAuthGuardAdmin)
    @Mutation(() => DefaultMessage)
    async deleteVideo(@Args('input', { type: () => DeleteVideoInput }) input: DeleteVideoInput) {
        return this.service.delete(input);
    }

    // WEB
    @Query(() => [Videos])
    async listVideos() {
        return this.service.list();
    }

    // ADMIN
    @UseGuards(GqlAuthGuardAdmin)
    @Query(() => [VideoPage])
    async searchVideo(@Args('input', { type: () => SearchVideoInput }) input: SearchVideoInput) {
        return this.service.search(input);
    }

    @UseGuards(GqlAuthGuardAdmin)
    @Query(() => Videos)
    async byIdVideos(@Args('id', { type: () => String }) id: string) {
        return this.service.byId(id);
    }
}
