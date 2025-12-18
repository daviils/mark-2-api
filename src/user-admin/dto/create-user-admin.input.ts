import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateUserAdminInput {

    @Field()
    name: string

    @Field()
    email: string

    @Field({ nullable: true })
    password?: string;

}

