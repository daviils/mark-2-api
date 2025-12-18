import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class BasePagination{
    @Field(() => Int)
    totalCount: Number;
    
    @Field(() => Int)
    pageSize: Number;

    @Field(() => Int)
    currentPage: Number;

    @Field(() => Int)
    totalPage: Number;

    @Field(() => Boolean)
    previousPage: boolean;

    @Field(() => Boolean)
    nextPage: boolean;
}
