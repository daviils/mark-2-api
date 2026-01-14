import { Field, ObjectType } from '@nestjs/graphql';
import { BasePagination } from '../../common/pagination.object';
import { Topic } from '../entity/topic.entity';


@ObjectType()
export class TopicPage extends BasePagination {
    @Field(() => [Topic], { nullable: true })
    results?: Topic[];
}