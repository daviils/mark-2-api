import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { VideosService } from '../service/videos.service';
import { Videos } from '../entity/videos.entity';
import { CreateVideoInput } from '../dto/create-video.input';
import { DefaultMessage } from 'src/common/default-message';
import { VideoPage } from '../dto/video-page';
import { SearchVideoInput } from '../dto/search-video.input';

@Resolver()
export class VideosResolver {
    constructor(
        private service: VideosService,
    ) { }

    @Mutation(() => DefaultMessage)
    async createVideo(@Args('input', { type: () => CreateVideoInput }) input: CreateVideoInput) {
        return this.service.create(input);
    }

    @Query(() => [Videos])
    async listVideos() {
        return this.service.list();
    }

    @Query(() => [VideoPage])
    async searchVideo(@Args('input', { type: () => SearchVideoInput }) input: SearchVideoInput) {
        return this.service.search(input);
    }

    @Query(() => Videos)
    async byIdVideos(@Args('id', { type: () => String }) id: string) {
        return this.service.byId(id);
    }
}
