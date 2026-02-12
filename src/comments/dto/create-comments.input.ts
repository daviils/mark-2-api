import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateCommentsInput {

    @Field()
    content: string

    @Field()
    topicId: string;
    
    @Field()
    createdBy: string;

}

@InputType()
export class UpdateCommentsInput extends CreateCommentsInput {

    @Field()
    id: string

}

@InputType()
export class DeleteCommentsInput {

    @Field()
    id: string

}


@InputType()
export class ReportCommentsInput {

    @Field()
    id: string

}

