import {Field, InputType} from '@nestjs/graphql';

// Cliente/Dentista (user_customer)
@InputType()
export class AuthInputCustomer {
    @Field()
    cpf: string;

    @Field()
    password: string;
}

// Admin Linea (user_admin)
@InputType()
export class AuthInputAdmin {
    @Field()
    email: string;

    @Field()
    password: string;
}
