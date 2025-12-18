import {Field, ObjectType} from '@nestjs/graphql';
import {UserAdmin} from "../../user-admin/entity/user-admin.entity";

// // Cliente/Dentista (user_customer)
// @ObjectType()
// export class AuthType {
//     @Field(() => UserCustomer)
//     user: UserCustomer;

//     @Field()
//     token: string;
// }

// Admin Linea (user_admin)
@ObjectType()
export class AuthTypeAdmin {
    @Field(() => UserAdmin)
    user: UserAdmin;

    @Field()
    token: string;
}


