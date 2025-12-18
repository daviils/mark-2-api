import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateUserInput {

    @Field({ nullable: true })
    photoUrl?: string;

    @Field()
    name: string

    @Field()
    phone: string

    @Field()
    whatsapp?: string;

    @Field({ nullable: true })
    password?: string;

    @Field()
    document: string

}

