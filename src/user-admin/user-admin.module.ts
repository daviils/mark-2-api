import { Module } from '@nestjs/common';
import { UserAdminService } from './service/user-admin.service';
import { UserAdminResolver } from './resolver/user-admin.resolver';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserAdmin} from './entity/user-admin.entity';

@Module({
  imports:[
   TypeOrmModule.forFeature([
    UserAdmin,
   ]),
  ],
   providers: [UserAdminService, UserAdminResolver]
})
export class UserAdminModule {}

