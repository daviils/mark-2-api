import { Field, ObjectType } from '@nestjs/graphql';
import { BasePagination } from '../../common/pagination.object';
import { Videos } from '../entity/videos.entity';


@ObjectType()
export class VideoPage extends BasePagination {
    @Field(() => [Videos], { nullable: true })
    results?: Videos[];
}