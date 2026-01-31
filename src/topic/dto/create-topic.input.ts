import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateTopicInput {

    @Field()
    title: string

    @Field()
    link: string;
    
    @Field()
    createdBy: string;

}

@InputType()
export class UpdateTopicInput extends CreateTopicInput {

    @Field()
    id: string

}

@InputType()
export class DeleteTopicInput {

    @Field()
    id: string

}

@InputType()
export class ReportTopicInput {

    @Field()
    id: string

}

