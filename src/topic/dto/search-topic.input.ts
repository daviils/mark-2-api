import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class SearchTopicInput {
    @Field(() => Int, { nullable: true, defaultValue: 1 })
    page?: number;

    @Field({ nullable: true })
    keyword?: string;

}


@InputType()
export class SearchTopicAdminInput extends SearchTopicInput {

    @Field(() => Date, { nullable: true })
    start?: Date;

    @Field(() => Date, { nullable: true })
    end?: Date;
}
