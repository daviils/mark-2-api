import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class ImportVideoInput {
    
    @Field()
    title: string

    @Field()
    link: string

}
