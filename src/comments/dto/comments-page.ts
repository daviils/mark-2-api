import { Field, ObjectType } from '@nestjs/graphql';
import { BasePagination } from '../../common/pagination.object';
import { Comments } from '../entity/comments.entity';


@ObjectType()
export class CommentsPage extends BasePagination {
    @Field(() => [Comments], { nullable: true })
    results?: Comments[];
}