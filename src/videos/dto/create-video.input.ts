import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateVideoInput {

    @Field()
    title: string

    @Field()
    description: string

    @Field()
    thumb: string;

    @Field()
    urlExternal: string;

    @Field()
    site: string;

    @Field()
    tags: string;

}

